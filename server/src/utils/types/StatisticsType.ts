import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class StatisticsDetail {
    @Field()
      service: string;

    @Field()
      number: number;

    @Field()
      mobileRate: number;

    @Field()
      waitingTimeAverage: number;

    @Field()
      returnedRate: number;

    @Field()
      firstTimeRate: number;
}

@ObjectType()
class DailyStatistics {
    @Field()
      date: string;

    @Field()
      total: number;

    @Field(() => [StatisticsDetail])
      detail: StatisticsDetail[];
}
export { DailyStatistics };
