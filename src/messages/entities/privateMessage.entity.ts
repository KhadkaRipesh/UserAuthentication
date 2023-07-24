import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('private_message')
export class PrivateMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (fromUser: User) => fromUser.privateMessages)
  fromUser: User;

  @ManyToOne(() => User, (toUser: User) => toUser.receivedPrivateMessage)
  toUser: User;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
