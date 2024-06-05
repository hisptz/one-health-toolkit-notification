import { AppProcess } from './app';
import { LogsUtil } from './utils';

startAppProcess();

async function startAppProcess() {
  try {
    await new LogsUtil().clearLogs();
    await new LogsUtil().addLogs(
      'info',
      `Start of One Health Toolkit's notification script`,
      'App'
    );
    const appProcess = new AppProcess();
    //TODO start the process
    console.log('validation trigger process');
    console.log('emial notificatio  count');
    await new LogsUtil().addLogs(
      'info',
      `End of One Health Toolkit's notification script`,
      'App'
    );
  } catch (error: any) {
    await new LogsUtil().addLogs('error', error.toString(), 'App');
  }
}
