import { PrivateMessage } from 'src/messages/entities/privateMessage.entity';
import { GroupMessage } from 'src/messages/entities/groupMessage.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    description: 'This is the unique id',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'User name',
    example: 'Ripesh k',
  })
  @Column()
  username: string;

  @ApiProperty({
    description: 'Email Address',
    example: 'khadka@gmail.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'Hashed user Password',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'Is user Verified',
  })
  @Column({ default: false, nullable: true })
  isVerified: boolean;

  @ApiProperty({
    description: 'User otp here.',
  })
  @Column()
  otp: number;

  @ApiProperty({
    description: 'User otp expiry date.',
  })
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
