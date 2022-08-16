import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'chatting', cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  // 1
  constructor() {
    this.logger.log('constructor');
  }

  // 2
  afterInit(): any {
    this.logger.log('init');
  }

  // 3
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected: ${socket.id} ${socket.nsp.name}`);
  }

  // 4
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected: ${socket.id} ${socket.nsp.name}`);
  }

  @SubscribeMessage('new_user')
  handleNewUser(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    socket.broadcast.emit('new_chat', { msg: `${data}님이 입장하였습니다` });
  }

  @SubscribeMessage('submit_chat')
  handleSubmitChat(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('new_chat', data);
    socket.emit('new_chat', data);
  }
}
