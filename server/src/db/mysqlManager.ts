import { Global, Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import { DatabaseConfig } from '../config/database.config';

@Global()
@Injectable()
export class MySqlManager {
  private pool?: mysql.Pool;

  constructor(private configService: ConfigService) {
    const databaseConfig = this.configService.get<DatabaseConfig>('database');
    this.createPool(databaseConfig as DatabaseConfig);
  }

  async createPool(databaseConfig: DatabaseConfig) {
    this.pool = mysql.createPool({
      host: databaseConfig.host,
      user: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      connectionLimit: 20,
    });
  }

  async execute(
    connectionCall: (connection: mysql.PoolConnection) => Promise<void>,
  ) {
    if (!this.pool) {
      throw new HttpException('pool이 생성되지 않았습니다.', 404);
    }

    // throw new HttpException('쿼리 에러', 404);

    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {
      await connectionCall(connection);
      await connection.commit();
    } catch (e) {
      console.error('rollback');
      connection && (await connection.rollback());
      throw e;
    } finally {
      connection && connection.release();
    }
  }
}
