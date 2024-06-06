import { AppUtil, LogsUtil } from '.';
import { DHIS2_PREDICTOR_CONSTANT } from '../configs';

export class Dhis2PredictorUtil {
  private _url: string;
  private _headers: { 'Content-Type': string; Authorization: string };

  constructor(username: string, password: string, baseUrl: string) {
    this._url = baseUrl;
    this._headers = AppUtil.getHttpAuthorizationHeader(username, password);
  }

  async runPredictorsByGroup(startDate: string, endDate: string) {
    try {
      await new LogsUtil().addLogs(
        'info',
        `Start Manual process for run Predictors by Groups from ${startDate} to ${endDate}`,
        'Validation Rule Process'
      );
      for (const predictorGroup of DHIS2_PREDICTOR_CONSTANT.predictorGroups) {
        console.log(predictorGroup);
        // predictorGroups/${predictorGroup.id}/run?startDate=${startDate}&endDate=${endDate}
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Dhis2PredictorUtil'
      );
    }
  }
}
