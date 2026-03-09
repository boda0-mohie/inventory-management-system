import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    price: number;

    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @ManyToOne(() => Category, (category) => category.products, {eager: true})
    @JoinColumn({name: 'category_id'})
    category: Category;

    @Column({
        type: 'int',
        default: 0
    })
    low_stock_threshold: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}