import { Field, InputType, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MaxLength } from 'class-validator';

@Entity()
@ObjectType()
class WaitingRoom {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 100 })
  name: string;
}

@InputType()
export class WaitingRoomInput {
  @Field()
  @MaxLength(100)
  name: string;
}

export default WaitingRoom;
