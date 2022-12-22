import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { MaxLength } from 'class-validator';
import RoleEnum from '../RoleEnum';
import Ticket from './Ticket';

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
  @Column({ length: 100 })
    password: string;

  @Field()
  @Column()
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
  @Column({ length: 100 })
    lastname: string;

  @Field()
  @Column({ length: 100 })
    email: string;

  @Field()
  @Column({ length: 100 })
    password: string;

  @Field()
  @Column({ length: 100 })
    role: RoleEnum;
}

export default User;
