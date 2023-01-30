import { Field, ObjectType } from 'type-graphql';
import {
  Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import { RoleEnum } from '../RoleEnum';
import Ticket from './Ticket';
import Service from './Service';
import Counter from './Counter';

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
  @Column({ length: 100 })
    email: string;

  @Field()
  @Column({ length: 100 })
    password: string;

  @Field()
  @Column({ type: 'enum', enum: RoleEnum })
    role: RoleEnum;

  @Field(() => Counter, { nullable: true })
  @OneToOne(() => Counter, (counter: Counter | null) => counter?.user, {
    nullable: true,
    eager: true,
  })
    counter?: Counter | null;

  @Field(() => [Ticket], { nullable: true })
  @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets: Ticket[];

  @Field(() => [Service], { nullable: true })
  @ManyToMany(() => Service, (service) => service.users, { cascade: true })
  @JoinTable()
    services: Service[];
}

export default User;
