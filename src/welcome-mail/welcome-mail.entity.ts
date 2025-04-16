import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from '../users/users.entity';
  
  @Entity()
  export class WelcomeMail {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { eager: true })
    student: User;
  
    @ManyToOne(() => User, { eager: true })
    admin: User;
  
    @Column({ default: false })
    isSent: boolean;
  
    @CreateDateColumn()
    sentAt: Date;
  }