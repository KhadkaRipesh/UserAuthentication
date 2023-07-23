import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (from: User) => from.groupMessages)
  from: User;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
