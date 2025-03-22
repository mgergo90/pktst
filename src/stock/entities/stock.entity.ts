import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Symbol } from './symbol.entity';

@Entity()
@Unique(['symbol_id', 'timestamp']) // Ensures that symbol_id and timestamp together are unique
export class Stock {
  @PrimaryGeneratedColumn()
  id: number; // Primary key

  @ManyToOne(() => Symbol, (symbol) => symbol.id)
  @JoinColumn({ name: 'symbol_id' })
  symbol_id: Symbol; // Foreign key reference to the Symbol entity

  @Column('decimal')
  price: number;

  @Column()
  timestamp: string;

  @CreateDateColumn()
  created: Date;
}
