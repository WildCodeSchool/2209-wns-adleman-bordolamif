import { Field, InputType, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MaxLength } from 'class-validator';
import RoleEnum from '../RoleEnum';

@Entity()
@ObjectType()
class User {
    @Field()
    @PrimaryGeneratedColumn()
      id: number;

    @Field()
    @Column({ length: 100 })
      firstname: string;

    @Field()
    @Column({ length: 100 })
      lastname: string;

    @Field()
    @Column({ length: 100 })
      email: string;

    @Field()
    @Column({ length: 100 })
      password: string;

    @Field()
    @Column({ length: 100 })
      role: RoleEnum;
}

@InputType()
export class UserInput {
    @Field()
    @MaxLength(100)
      firstname: string;

    @Field()
    @Column({ length: 100 })
      lastname: string;

    @Field()
    @Column({ length: 100 })
      email: string;

    @Field()
    @Column({ length: 100 })
      password: string;

    @Field()
    @Column({ length: 100 })
      role: RoleEnum;
}

export default User;
