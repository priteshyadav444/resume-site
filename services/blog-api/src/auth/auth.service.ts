import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Simple admin validation using env variables (for demo). In production, use proper user store and hashed passwords.
  async validateAdmin(email: string, password: string) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@local'
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123'
    if (email === adminEmail && password === adminPass) {
      return { sub: email }
    }
    return null
  }

  async loginAdmin(email: string, password: string) {
    const user = await this.validateAdmin(email, password)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const payload = { username: email }
    return { accessToken: this.jwtService.sign(payload) }
  }
}
