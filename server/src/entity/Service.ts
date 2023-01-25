import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import WaitingRoom from './WaitingRoom';
import Ticket from './Ticket';
import User from './User';

@Entity()
@ObjectType()
class Service {
  @Field()
  @PrimaryGeneratedColumn()
    id: number;

  @Field()
  @Column({ length: 100 })
    name: string;

  @Field()
  @Column({ length: 3 })
    acronym: string;

  @Field()
  @Column()
    open: boolean;

  @Field()
  @Column({ length: 6 })
    color: string;

  @Field(() => WaitingRoom, { nullable: true })
  @ManyToOne(() => WaitingRoom, (waitingRoom) => waitingRoom.service)
    waitingRoom?: WaitingRoom;

  @Field(() => [Ticket], { nullable: true })
  @OneToMany(() => Ticket, (ticket) => ticket.service)
    tickets?: Ticket[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.services)
    users: User[];
}

export default Service;
