import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthInput, AuthType } from '../dto';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) { }

  @Mutation(() => AuthType)
  public async login(
    @Args('data') data: AuthInput
  ): Promise<AuthType> {
    const response = await this.authService.validateUser(data);

    return {
      user: response.user,
      token: response.token
    }
  }
}