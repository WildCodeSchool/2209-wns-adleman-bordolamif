import {Field, ObjectType} from "type-graphql";
import {Column, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
class Counter {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({length: 100})
    name: string;
}

export default Counter
