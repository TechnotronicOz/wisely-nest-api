import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService, UserLoginDTO } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { InjectOgma, OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { AuthLoginInputDTO } from './dto/auth-login.input.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @OgmaLogger(AuthController) private readonly logger: OgmaService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    this.logger.log(`logging in user [user=${req.user}]`);
    return this.authService.loginUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Request() req) {
    this.logger.log('logging user out', req.user);
    return req.user;
  }
}
