import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { verify } from 'argon2';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUSer(CreateUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(CreateUserDto.email);

    if (user) throw new ConflictException('User already exists');
    return this.userService.create(CreateUserDto);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    const isPasswordMatched = verify(user.password, password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid credentials');

    return { id: user.id, name: user.name };
  }

  async login(userId: number, name?: string) {
    const { accessToken } = await this.generateTokens(userId);
    return {
      id: userId,
      name: name,
      accessToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(payload),
    ]);

    return { accessToken };
  }

  async validateJwtUser(userId: number) {
    //have to put await here unlsess findOne will return a promise
    // and user will not be a user, it will be a promise. and !user is always gonna be true
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('user not found!');
    const currentUser = { id: user.id };
    return currentUser;
  }
}
