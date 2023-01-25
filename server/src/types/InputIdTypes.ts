import { Field, InputType } from 'type-graphql';

@InputType()
export class ServiceId {
  @Field()
    id: number;
}

@InputType()
export class UserId {
  @Field()
    id: number;
}

@InputType()
export class CounterId {
  @Field()
    id: number;
}

@InputType()
export class WaitingRoomId {
  @Field()
    id: number;
}
