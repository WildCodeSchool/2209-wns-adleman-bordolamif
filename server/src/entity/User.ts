import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsEmail, Matches, MaxLength, MinLength,
} from 'class-validator';
import { RoleEnum } from '../RoleEnum';
import Ticket from './Ticket';
import { argon2id, hash, verify } from 'argon2';

@Entity()
@ObjectType()
class User {
  @Field()
  @PrimaryGeneratedColumn()
    id: number;

  @Field()
  @Column({ length: 100 })
    firstname: string;

  @Field()
  @Column({ length: 100 })
    lastname: string;

  @Field()
  @Column({ length: 100 })
    email: string;

  @Field()
  @Column({ nullable: true })
    hashedPassword?: string;

  @Field()
  @Column({ type: 'enum', enum: RoleEnum })
    role: RoleEnum;

  @OneToMany(() => Ticket, (ticket) => ticket.service)
    tickets?: Ticket[];
}

@InputType()
export class UserInput {
  @Field()
  @MaxLength(100)
    firstname: string;

  @Field()
  @MaxLength(100)
    lastname: string;

  @Field()
  @MaxLength(100)
  @IsEmail()
    email: string;

  @Field()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    password: string;

  @Field()
    role: RoleEnum;
}

@InputType()
export class UserConnexion {
  @Field()
  @MaxLength(100)
  @IsEmail()
    email: string;

  @Field()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    password: string;
}

const hashingOptions = {
  memoryCost: 2 ** 16,
  timeCost: 5,
  type: argon2id,
};

// eslint-disable-next-line max-len
export const hashPassword = async (plainPassword: string): Promise<string> => await hash(plainPassword, hashingOptions);

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => await verify(hashedPassword, plainPassword, hashingOptions);

export const getSafeAttributes = (user: User): User => ({
  ...user,
  hashedPassword: undefined,
});

export default User;
