import { UUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Trip } from '../trip/trip.entity';

@Entity({ name: 'tourist' })
export class Tourist {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Trip, trip => trip.tourist)
  trips: Trip[];
}
