import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MaxLength } from "class-validator";

@Entity()
@ObjectType()
class Counter {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ length: 100 })
    name: string;
}

@InputType()
export class CounterInput {
    @Field()
    @MaxLength(100)
    name: string;
}

export default Counter;
