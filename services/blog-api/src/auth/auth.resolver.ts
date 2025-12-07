import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // Return the access token string directly so GraphQL can infer the type
  @Mutation(() => String)
  async loginAdmin(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    const res = await this.authService.loginAdmin(email, password)
    // authService returns { accessToken }, return the token string
    return res.accessToken
  }
}
