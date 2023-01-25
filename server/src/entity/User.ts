import { Field, ObjectType } from 'type-graphql';
import {
  Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import { RoleEnum } from '../RoleEnum';
import Ticket from './Ticket';
import Service from './Service';

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
  @Column({ type: 'enum', enum: RoleEnum })
    role: RoleEnum;

  @Field(() => [Ticket], { nullable: true })
  @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets: Ticket[];

  @Field(() => [Service], { nullable: true })
  @ManyToMany(() => Service, (service) => service.users, { cascade: true })
  @JoinTable()
    services: Service[];
}

export default User;
