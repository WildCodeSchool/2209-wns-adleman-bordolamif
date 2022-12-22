import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { MaxLength } from 'class-validator';
import Service from './Service';
import Counter from './Counter';

@Entity()
@ObjectType()
class WaitingRoom {
  @Field()
  @PrimaryGeneratedColumn()
    id: number;

  @Field()
  @Column({ length: 100 })
    name: string;

  @OneToMany(() => Service, (service) => service.waitingRoom)
    service?: Service;

  @OneToMany(() => Counter, (counter) => counter.waitingRoom)
    counter?: Counter;
}

@InputType()
export class WaitingRoomInput {
  @Field()
  @MaxLength(100)
    name: string;
}

export default WaitingRoom;
