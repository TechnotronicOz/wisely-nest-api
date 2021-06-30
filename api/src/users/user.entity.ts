import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './roles/role.enum';
import { hashPass } from '../util/passwords';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: Role.User })
  role: Role;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn({ nullable: true })
  updated?: Date;

  @BeforeInsert()
  async hashPassword(): Promise<string> {
    this.password = await hashPass(this.password);
    return this.password;
  }

  @BeforeInsert()
  setUserRole(): string {
    this.role = Role.User;
    return this.role;
  }
}
