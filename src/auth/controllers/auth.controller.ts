import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../decorator/current-user.decorator";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthService } from "../services/auth.service";
import * as authUser from "../types/auth-user";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: authUser.AuthUser) {
    return this.authService.getMe(user.id);
  }

  @Patch("change-password")
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser() user: authUser.AuthUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }
}
