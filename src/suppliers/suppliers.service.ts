import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a new supplier
   * @param createSupplierDto
   * @returns new supplier
   */
  async create(
    createSupplierDto: CreateSupplierDto,
    user_id: string,
  ): Promise<Supplier> {
    const { name, contact_person, email, phone, address } = createSupplierDto;
    const supplier = this.supplierRepository.create({
      name,
      contact_person,
      email,
      phone,
      address,
    });
    const user = await this.usersService.getCurrentUser(user_id);
    supplier.created_by = user.id;
    return await this.supplierRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return await this.supplierRepository.find();
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOneBy({ id });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const supplier = await this.findOne(id);
    const { name, contact_person, email, phone, address } = updateSupplierDto;
    supplier.name = name ?? supplier.name;
    supplier.contact_person = contact_person ?? supplier.contact_person;
    supplier.email = email ?? supplier.email;
    supplier.phone = phone ?? supplier.phone;
    supplier.address = address ?? supplier.address;
    return await this.supplierRepository.save(supplier);
  }

  async remove(id: number): Promise<void> {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);
  }
}
