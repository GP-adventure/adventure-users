import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Users {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ unique: true })
  public email!: string;

  @Column()
  public username!: string;

  @Column()
  @Exclude()
  public password!: string;

  @Column({ default: false })
  @Exclude()
  public isEmailConfirmed!: boolean;
}

export default Users;
