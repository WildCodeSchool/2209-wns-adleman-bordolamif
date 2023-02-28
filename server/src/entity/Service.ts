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
  @Column({ length: 100, unique: true })
    name: string;

  @Field()
  @Column({ length: 3, unique: true })
    acronym: string;

  @Field()
  @Column()
    open: boolean;

  @Field()
  @Column({ length: 6, unique: true })
    color: string;

  @Field(() => WaitingRoom, { nullable: true })
  @ManyToOne(() => WaitingRoom, (waitingRoom) => waitingRoom.services)
    waitingRoom?: WaitingRoom;

  @Field(() => [Ticket], { nullable: true })
  @OneToMany(() => Ticket, (ticket) => ticket.service, { nullable: true })
    tickets?: Ticket[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.services, { nullable: true })
    users?: User[];

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.currentService)
    currentUsers?: User[];
}

export default Service;
