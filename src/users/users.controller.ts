import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import * as type from 'utils/type';
import { AuthGuard } from './guards/auth.guard';
import { AuthRolesGuard } from './guards/auth-role.guard';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { Roles } from './decorators/user-role.decorator';
import { Role } from 'utils/enum';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // POST: ~/api/users/auth/register
  @Post('auth/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('auth/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // POST: ~/api/users/auth/refresh
  @Post('auth/refresh')
  @UseGuards(RefreshAuthGuard)
  refresh(@Req() req: Request) {
    return this.authService.refreshTokens(req['user'].refreshToken);
  }

  // POST: ~/api/users/auth/logout
  @Post('auth/logout')
  @UseGuards(AuthGuard)
  logout(@CurrentUser() user: type.JWTPayloadType) {
    return this.authService.revokeRefreshTokens(user.sub);
  }

  // GET: ~/api/users/me
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: type.JWTPayloadType) {
    return this.usersService.getCurrentUser(user.sub);
  }
}
