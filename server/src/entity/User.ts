import { Field, ObjectType } from 'type-graphql';
import {
  Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEnum } from '../RoleEnum';
import Ticket from './Ticket';
import { argon2id, hash, verify } from 'argon2';
import Counter from './Counter';
import Service from './Service';
import { IsEmail } from 'class-validator';

@Entity()
@ObjectType()
class User {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

  @Field()
  @Column({ length: 100 })
    firstname: string;

  @Field()
  @Column({ length: 100 })
    lastname: string;

  @Field()
  @Column({ length: 100, unique: true })
  @IsEmail()
    email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
    hashedPassword?: string;

  @Field()
  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.Client })
    role: RoleEnum;

  @Field({ nullable: true })
  @Column({ nullable: true })
    resetPasswordToken?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
    resetPasswordExpires?: Date;

  @Field(() => Counter, { nullable: true })
  @OneToOne(() => Counter, (counter: Counter | null) => counter?.user, {
    nullable: true,
    eager: true,
  })
    counter?: Counter | null;

  @Field(() => [Ticket], { nullable: true })
  @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets?: Ticket[];

  @Field(() => [Service], { nullable: true })
  @ManyToMany(() => Service, (service) => service.users, { nullable: true, cascade: true })
  @JoinTable()
    services?: Service[];
}

const hashingOptions = {
  memoryCost: 2 ** 16,
  timeCost: 5,
  type: argon2id,
};

export const hashPassword = async (
  plainPassword: string,
): Promise<string> => await hash(plainPassword, hashingOptions);

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => await verify(hashedPassword, plainPassword, hashingOptions);

export const getSafeAttributes = (user: User): User => ({
  ...user,
  hashedPassword: undefined,
});

export default User;
