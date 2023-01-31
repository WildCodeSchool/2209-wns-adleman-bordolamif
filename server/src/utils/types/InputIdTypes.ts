import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class ServiceId {
  @Field(() => Int)
    id: number;
}

@InputType()
export class UserId {
  @Field(() => Int)
    id: number;
}

@InputType()
export class CounterId {
  @Field(() => Int)
    id: number;
}

@InputType()
export class WaitingRoomId {
  @Field(() => Int)
    id: number;
}
