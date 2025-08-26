import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect, MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/vtt' })
export class MarkersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(_client: Socket) {}
  handleDisconnect(_client: Socket) {}

  broadcast(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  @SubscribeMessage('moveMarker')
  handleMoveMarker(@MessageBody() body: { sessionId: string; sceneId: number; marker: any }) {
    this.server.emit('markerMoved', body);
  }

  @SubscribeMessage('createMarker')
  handleCreateMarker(@MessageBody() body: { sessionId: string; sceneId: number; marker: any }) {
    this.server.emit('markerCreated', body);
  }

  @SubscribeMessage('deleteMarker')
  handleDeleteMarker(@MessageBody() body: { sessionId: string; sceneId: number; markerId: number }) {
    this.server.emit('markerDeleted', body);
  }
}