import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/user.service';
 
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: UserService) {
    super({
      usernameField: 'username'
    });
  }
  async validate(username: string, password: string): Promise<User> {
    return this.authenticationService.login({ username, password});
  }
}