import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('group_message')
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (fromUser: User) => fromUser.groupMessages)
  fromUser: User;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
