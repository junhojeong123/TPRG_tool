import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MoveMarkerCommand } from './commands/impl/move-marker.command';
import { Logger, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../../auth/ws-auth.guard';
import { GetMarkersBySceneQuery } from './queries/impl/get-markers-by-scene.query';

@UseGuards(WsAuthGuard) // 게이트웨이 전체에 인증 가드를 적용합니다.
@WebSocketGateway({ namespace: '/vtt' })
export class MarkersGateway {
  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(MarkersGateway.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @SubscribeMessage('markers:move')
  async handleMarkerMove(
    @MessageBody() data: { markerId: string; position: { x: number; y: number }; sceneId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.logger.log(`Received marker move event: ${JSON.stringify(data)}`);

    const command = new MoveMarkerCommand(data.markerId, data.position, data.sceneId);
    const updatedMarker = await this.commandBus.execute(command);

    client.broadcast.to(data.sceneId).emit('markers:updated', updatedMarker);
  }

  @SubscribeMessage('scene:join')
  async handleSceneJoin(
    @MessageBody() data: { sceneId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    client.join(data.sceneId);
    this.logger.log(`Client ${client.id} joined scene (room): ${data.sceneId}`);

    const markers = await this.queryBus.execute(
      new GetMarkersBySceneQuery(data.sceneId),
    );

    client.emit('scene:state', markers);
  }
}