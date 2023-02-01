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
  @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

  @Field()
  @Column({ length: 100, unique: true })
    name: string;

  @Field(() => WaitingRoom)
  @ManyToOne(() => WaitingRoom, (waitingRoom) => waitingRoom.counters)
    waitingRoom: WaitingRoom;

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, (user: User | null) => user?.counter, { nullable: true })
  @JoinColumn()
    user?: User;
}

export default Counter;
