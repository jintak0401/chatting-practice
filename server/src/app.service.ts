import { Inject, Injectable } from '@nestjs/common';
import { MySqlManager } from './db/mysqlManager';

@Injectable()
export class AppService {
  @Inject()
  mySqlManager: MySqlManager;

  async getTown() {
    let ret;
    await this.mySqlManager.execute(async (connection) => {
      ret = await connection.query('SELECT * FROM TOWN_TB');
    });
    return ret;
  }
}
