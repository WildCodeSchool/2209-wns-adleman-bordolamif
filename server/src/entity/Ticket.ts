import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MaxLength } from 'class-validator';
import Service from './Service';
import User from './User';

@Entity()
@ObjectType()
class Ticket {
    @Field()
    @PrimaryGeneratedColumn()
      id: number;

    @Field()
    @Column({ length: 100 })
      name: string;

    @Field()
    @CreateDateColumn()
      CreatedAt?: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
      CalledAt?: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
      ClosedAt?: Date;

    @Field()
    @Column()
      isFirstTime: boolean;

    @Field({ nullable: true })
    @Column({ nullable: true })
      isReturned?: boolean;

    @ManyToOne(() => Service, (service) => service.tickets)
      service?: Service;

    @ManyToOne(() => User, (user) => user.tickets, { nullable: true })
      user?: User;
}

@InputType()
export class TicketInput {
    @Field()
    @MaxLength(100)
      name: string;
}

export default Ticket;
