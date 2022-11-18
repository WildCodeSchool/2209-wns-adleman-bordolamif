import {Arg, Mutation, Query, Resolver} from "type-graphql";
import User, {UserInput} from "../entity/User";
import dataSource from "../db";

@Resolver(User)
export class UserResolver {

    /*************************************
     QUERY
     *************************************/

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        return await dataSource.getRepository(User).find()
    }

    /*************************************
     MUTATION
     *************************************/

    @Mutation(() => User)
    async createUser(@Arg("data") data: UserInput): Promise<User> {
        return await dataSource.getRepository(User).save(data);
    }
}
