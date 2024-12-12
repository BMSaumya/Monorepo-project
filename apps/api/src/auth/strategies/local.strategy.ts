import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  //checking DB
  //this validate function will be appedned to request obj. we can get this object from request.user
  validate(email: string, password: string) {
    if (password === '')
      throw new UnauthorizedException('please provide your password');
    return this.authService.validateLocalUser(email, password);
  }
}
