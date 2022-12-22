import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MaxLength } from 'class-validator';
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

  @ManyToOne(() => WaitingRoom, (waitingRoom) => waitingRoom.counter)
    waitingRoom?: WaitingRoom;

  @OneToOne(() => User)
  @JoinColumn()
    user?: User;
}

@InputType()
export class CounterInput {
  @Field()
  @MaxLength(100)
    name: string;
}

export default Counter;
