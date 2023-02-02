import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Service from './Service';
import User from './User';

@Entity()
@ObjectType()
class Ticket {
    @Field()
    @PrimaryGeneratedColumn()
      id: number;

    @Field()
    @Column()
      name: string;

    @Field()
    @CreateDateColumn()
      createdAt?: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
      calledAt?: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
      closedAt?: Date;

    @Field()
    @Column()
      isFirstTime: boolean;

    @Field({ nullable: true })
    @Column({ nullable: true })
      isReturned?: boolean;

    @Field(() => Service)
    @ManyToOne(() => Service, (service) => service.tickets)
      service: Service;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, (user) => user.tickets, { nullable: true })
      user?: User;
}

export default Ticket;
