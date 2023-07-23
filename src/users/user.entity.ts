import { GroupMessage } from 'src/messages/groupMessage.entity';
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
    (groupMessage: GroupMessage) => groupMessage.from,
  )
  public groupMessages: GroupMessage[];
}
