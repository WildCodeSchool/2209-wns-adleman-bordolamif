import { Field, InputType, ObjectType } from "type-graphql";
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { MaxLength } from "class-validator";
import WaitingRoom from "./WaitingRoom";
import Ticket from "./Ticket";
import User from "./User";

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

    @Field({ nullable: true })
    @Column({ nullable: true })
    waitingRoomId?: number;

    @ManyToOne(() => WaitingRoom, (waitingRoom) => waitingRoom.service)
    waitingRoom?: WaitingRoom;

    @OneToMany(() => Ticket, (ticket) => ticket.service)
    tickets?: Ticket[];

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];
}

@InputType()
export class ServiceInput {
    @Field()
    @MaxLength(100)
    name: string;

    @Field()
    @MaxLength(3)
    acronym: string;

    @Field()
    open: boolean;

    @Field()
    @MaxLength(6)
    color: string;

    @Field({ nullable: true })
    waitingRoomId?: number;
}

export default Service;
