import { FileUtil } from '.';
import moment from 'moment';

export class LogsUtil {
  private logsfileName: string;
  private fileUtil: FileUtil;

  constructor(logsfileName: string = 'logs', logsDir: string = 'logs') {
    this.logsfileName = logsfileName;
    this.fileUtil = new FileUtil(logsDir, this.logsfileName);
  }

  async clearLogs() {
    const data = '';
    try {
      await this.fileUtil.writeToFile(data, false);
    } catch (error: any) {
      error = error.message || error;
      console.log({ error });
    }
  }

  async addLogs(type = 'INFO', message: any, resource = '') {
    const time = moment().format('YYYY-MM-DD hh:mm:ss.SSS A');
    const data = `${time} ${type.toUpperCase()}(${resource}) ${message}\n`;
    const flag = 'a+';
    try {
      await this.fileUtil.writeToFile(data, false, flag);
    } catch (error: any) {
      error = error.message || error;
      console.log({ error });
    }
  }
}
