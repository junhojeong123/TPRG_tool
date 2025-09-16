import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
// import { JwtService } from '@nestjs/jwt'; // 실제 프로젝트에서는 JwtService를 주입받아 사용합니다.

@Injectable()
export class WsAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsAuthGuard.name);

  // constructor(private readonly jwtService: JwtService) {} // 실제 구현 시 주석 해제

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const authToken = client.handshake.auth?.token; // 클라이언트에서 보낸 토큰 추출

    if (!authToken) {
      this.logger.warn(`Client ${client.id} - No token provided.`);
      client.disconnect(); // 토큰이 없으면 연결을 강제로 끊습니다.
      return false;
    }

    try {
      // 실제 구현에서는 아래 로직을 사용합니다.
      // const payload = this.jwtService.verify(authToken);
      // client['user'] = payload; // 요청 객체에 사용자 정보를 첨부합니다.

      // 여기서는 임시로 토큰 존재 여부만 확인합니다.
      this.logger.log(`Client ${client.id} - Authenticated successfully.`);
      return true;
    } catch (err) {
      this.logger.warn(`Client ${client.id} - Authentication failed: ${err.message}`);
      client.disconnect();
      return false;
    }
  }
}