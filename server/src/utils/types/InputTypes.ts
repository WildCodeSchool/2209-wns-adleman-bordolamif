import {
  IsEmail, Matches, MaxLength, MinLength,
} from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { RoleEnum } from '../../RoleEnum';
import {
  CounterId, ServiceId, UserId, WaitingRoomId,
} from './InputIdTypes';

@InputType()
export class UserConnexion {
  @Field()
  @MaxLength(100)
  @IsEmail()
    email: string;

  @Field()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    password: string;
}

@InputType()
export class UserUpdatePassword {
  @Field()
  @MaxLength(100)
  @IsEmail()
    email: string;

  @Field()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    oldPassword: string;

  @Field()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    newPassword: string;
}

@InputType()
export class UserInput {
    @Field()
    @MaxLength(100)
      firstname: string;

    @Field()
    @MaxLength(100)
      lastname: string;

    @Field()
    @MaxLength(100)
    @IsEmail()
      email: string;

    @Field({ nullable: true })
    @MinLength(8)
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      password?: string;

    @Field({ defaultValue: RoleEnum.Client })
      role: RoleEnum;

    @Field(() => CounterId, { nullable: true })
      counter?: CounterId | null;

    @Field(() => [ServiceId], { nullable: true })
      services?: ServiceId[];
}

@InputType()
export class TicketInput {
    @Field()
    @MaxLength(100)
      name: string;

    @Field({ nullable: true })
      calledAt?: Date;

    @Field({ nullable: true })
      closedAt?: Date;

    @Field()
      isFirstTime: boolean;

    @Field({ nullable: true })
      isReturned?: boolean;

    @Field(() => UserId, { nullable: true })
      user?: UserId;

    @Field(() => ServiceId)
      service: ServiceId;
}

@InputType()
export class WaitingRoomInput {
    @Field()
    @MaxLength(100)
      name: string;
}

@InputType()
export class CounterInput {
    @Field()
    @MaxLength(100)
      name: string;

    @Field(() => WaitingRoomId, { nullable: true })
      waitingRoom: WaitingRoomId;

    @Field(() => UserId, { nullable: true })
      user?: UserId;
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

    @Field(() => WaitingRoomId, { nullable: true })
      waitingRoom: WaitingRoomId | null;
}
