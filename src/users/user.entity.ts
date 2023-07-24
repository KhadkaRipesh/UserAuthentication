import { PrivateMessage } from 'src/messages/entities/privateMessage.entity';
import { GroupMessage } from 'src/messages/entities/groupMessage.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false, nullable: true })
  isVerified: boolean;

  @Column()
  otp: number;

  @Column()
  expiryDate: Date;

  @OneToMany(
    () => GroupMessage,
    (groupMessage: GroupMessage) => groupMessage.fromUser,
  )
  public groupMessages: GroupMessage[];

  @OneToMany(
    () => PrivateMessage,
    (privateMessage: PrivateMessage) => privateMessage.fromUser,
  )
  public privateMessages: PrivateMessage[];

  @OneToMany(
    () => PrivateMessage,
    (receivedPrivateMessage: PrivateMessage) => receivedPrivateMessage.toUser,
  )
  public receivedPrivateMessage: PrivateMessage[];
}
