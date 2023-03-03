import {
  IsEmail, Matches, MaxLength, MinLength,
} from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { RoleEnum } from '../enums/RoleEnum';
import { StatusEnum } from '../enums/StatusEnum';
import {
  CounterId, ServiceId, TicketId, UserId, WaitingRoomId,
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
export class FirstUserLoginPassword {
  @Field()
  @MaxLength(100)
  @IsEmail()
    email: string;

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

    @Field(() => ServiceId, { nullable: true })
      currentService?: ServiceId | null;
}

@InputType()
export class TicketInput {
  @Field({ nullable: true })
  @MaxLength(100)
    name?: string;

    @Field({ defaultValue: StatusEnum.EnAttente })
      status: StatusEnum;

    @Field()
      isFirstTime: boolean;

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

    @Field(() => [ServiceId], { nullable: true })
      services?: ServiceId[];
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

    @Field(() => TicketId, { nullable: true })
      ticket?: TicketId;
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
    @MaxLength(7)
      color: string;

    @Field(() => WaitingRoomId, { nullable: true })
      waitingRoom: WaitingRoomId | null;
}
