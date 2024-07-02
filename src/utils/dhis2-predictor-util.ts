import { AppUtil, HttpUtil, LogsUtil } from '.';
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
        await new LogsUtil().addLogs(
          'info',
          `Process for run Predictors by Groups ${predictorGroup}`,
          'Validation Rule Process'
        );
        const response: any = await HttpUtil.postHttp(
          this._headers,
          `${this._url}/api/predictorGroups/${predictorGroup}/run?startDate=${startDate}&endDate=${endDate}`,
          {}
        );
        const httpStatusCode = response.httpStatusCode ?? 0;
        if (httpStatusCode !== 200) {
          await new LogsUtil().addLogs(
            'error',
            `Error while running predictor group ${predictorGroup} with status code ${httpStatusCode}`,
            'Dhis2PredictorUtil'
          );
        }
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
