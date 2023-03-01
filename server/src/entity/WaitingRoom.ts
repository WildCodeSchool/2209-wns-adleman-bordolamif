import { Field, ObjectType } from 'type-graphql';
import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
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

  @Field(() => [Service], { nullable: true })
  @OneToMany(() => Service, (service) => service.waitingRoom, { cascade: true })
    services?: Service[];

  @Field(() => [Counter], { nullable: true })
  @OneToMany(() => Counter, (counter) => counter.waitingRoom)
    counters?: Counter[];
}

export default WaitingRoom;
