import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JWTPayloadType } from 'utils/type';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user
   * @param registerDto
   * @returns JWT token and user object
   */
  public async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser(registerDto);

    const payload: JWTPayloadType = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  /**
   * Login a user
   * @param loginDto
   * @returns JWT token and user object
   */
  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JWTPayloadType = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  /**
   * Generate a new refresh token and save it to the database
   * @param user
   * @returns refresh token string
   */
  public async generateRefreshToken(user: User): Promise<string> {
    const payload = { sub: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d', // Default to 7 days if not configured
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refreshToken,
      user,
      expires_at: expiresAt,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return refreshToken;
  }

  /**
   * Refresh access token using a valid refresh token
   * @param token
   * @returns new access and refresh tokens
   */
  public async refreshTokens(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const refreshTokenEntity = await this.refreshTokenRepository.findOne({
        where: { token, revoked: false },
        relations: ['user'],
      });

      if (!refreshTokenEntity || refreshTokenEntity.expires_at < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Revoke old token
      refreshTokenEntity.revoked = true;
      await this.refreshTokenRepository.save(refreshTokenEntity);

      // Generate new pair
      const user = refreshTokenEntity.user;
      const newPayload: JWTPayloadType = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = await this.generateRefreshToken(user);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Revoke all refresh tokens for a user
   * @param userId
   */
  public async revokeRefreshTokens(userId: string) {
    await this.refreshTokenRepository.update(
      { user: { id: userId as any }, revoked: false },
      { revoked: true },
    );
  }
}
