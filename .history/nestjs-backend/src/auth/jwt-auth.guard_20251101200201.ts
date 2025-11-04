import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log("🛡️ JwtAuthGuard: checking token...");
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.log("❌ JwtAuthGuard blocked:", { err, info, user });
      throw err || new Error('Unauthorized');
    }
    console.log("✅ JwtAuthGuard passed:", user);
    return user;
  }
}
