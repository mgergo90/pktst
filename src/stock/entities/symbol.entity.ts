import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Stock } from './stock.entity';

@Entity()
@Index('symbol_unique', ['symbol'], { unique: true }) // Ensures 'symbol' is unique
export class Symbol {
  @PrimaryGeneratedColumn()
  id: number; // Unique ID (auto-incremented primary key)

  @Column({ type: 'varchar', length: 50, unique: true })
  symbol: string; // Symbol field (unique)

  @CreateDateColumn()
  createdAt: Date; // Created timestamp (automatically generated)

  @OneToMany(() => Stock, (stock) => stock.symbol_id, { lazy: true }) // One-to-many relationship
  stockPrices: Promise<Stock[]>;
}
