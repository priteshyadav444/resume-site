import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Object)
  async loginAdmin(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    return this.authService.loginAdmin(email, password)
  }
}
