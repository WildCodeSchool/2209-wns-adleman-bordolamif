import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Counter, { CounterInput } from "../entity/Counter";
import dataSource from "../db";

@Resolver(Counter)
export class CounterResolver {
    /*************************************
     QUERY
     *************************************/

    @Query(() => [Counter])
    async getAllCounters(): Promise<Counter[]> {
        return await dataSource.getRepository(Counter).find();
    }

    /*************************************
     MUTATION
     *************************************/

    @Mutation(() => Counter)
    async createCounter(@Arg("data") data: CounterInput): Promise<Counter> {
        return await dataSource.getRepository(Counter).save(data);
    }
}
