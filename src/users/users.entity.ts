import { Group } from 'src/groups/groups.entity';
import { ApprovalStatus, UserRole, UserStatus } from 'src/shared/constants/roles.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({nullable:false})
  age: string;

  @Column({ default: 'student' })
  role: UserRole;

  @Column({ default: 'active' })
  status: UserStatus;

  @Column({
    nullable: true, type: 'enum',
    enum: ApprovalStatus
  })
  approvalStatus?: ApprovalStatus;

  @Column()
  contactDetails: string;

  @Column({ nullable: true })
  currentCompany?: string;

  @Column({ nullable: true })
  expertise?: string;

  @Column('text', { array: true, nullable: true })
  skills?: string[];

  @ManyToOne(() => Group, (group) => group.students, { nullable: true })
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}