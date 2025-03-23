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
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  symbol: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Stock, (stock) => stock.symbol_id, { lazy: true })
  stockPrices: Promise<Stock[]>;
}
