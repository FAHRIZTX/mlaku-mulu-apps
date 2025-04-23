import { UUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Tourist } from '../tourist/tourist.entity';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ type: 'datetime' })
  tanggalMulaiPerjalanan: Date;

  @Column({ type: 'datetime' })
  tanggalBerakhirPerjalanan: Date;

  @Column()
  destinasiPerjalanan: string;

  @ManyToOne(() => Tourist, tourist => tourist.trips, { onDelete: 'CASCADE' })
  tourist: Tourist;
}
