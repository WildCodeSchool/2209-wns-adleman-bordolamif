import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';
import WaitingRoom from './WaitingRoom';

@Entity()
@ObjectType()
class Counter {
  @Field()
  @PrimaryGeneratedColumn()
    id: number;

  @Field()
  @Column({ length: 100 })
    name: string;

  @Field(() => WaitingRoom, { nullable: true })
  @ManyToOne(() => WaitingRoom, (waitingRoom) => waitingRoom.counter)
    waitingRoom?: WaitingRoom;

  @Field(() => User, { nullable: true })
  @OneToOne(() => User)
  @JoinColumn()
    user?: User;
}

export default Counter;
