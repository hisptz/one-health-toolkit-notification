import { flattenDeep, map } from 'lodash';
import { AppUtil, HttpUtil, LogsUtil } from '.';
import { DHIS2_VALIDATION_RULE_CONSTANT } from '../configs';
import { Dhis2ValidationRuleTriggerResponse } from '../models';

export class Dhis2ValidationRuleUtil {
  private _url: string;
  private _headers: { 'Content-Type': string; Authorization: string };

  constructor(username: string, password: string, baseUrl: string) {
    this._url = baseUrl;
    this._headers = AppUtil.getHttpAuthorizationHeader(username, password);
  }

  async triggerAndGetValidationRuleNotification(
    orgUnit: string
  ): Promise<Dhis2ValidationRuleTriggerResponse[]> {
    let validationRuleTriggers: Dhis2ValidationRuleTriggerResponse[] = [];
    try {
      const payload: any = this._getValidationRuleNotificationPayload(orgUnit);
      const response: any = await HttpUtil.postHttp(
        this._headers,
        `${this._url}/api/dataAnalysis/validationRules`,
        payload
      );
      validationRuleTriggers = map(response || [], (data) => {
        const { periodId, validationRuleDescription, organisationUnitId } =
          data;
        return {
          periodId,
          validationRuleDescription,
          organisationUnitId
        };
      });
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Dhis2ValidationRuleUtil'
      );
    }
    return flattenDeep(validationRuleTriggers);
  }

  private _getValidationRuleNotificationPayload(orgUnit: string) {
    const endDate = AppUtil.getFormattedDate(new Date());
    const startDate = AppUtil.getFormattedDate(
      new Date(
        new Date().setMonth(
          new Date().getMonth() -
            DHIS2_VALIDATION_RULE_CONSTANT.defaultNumberOfMonth
        )
      )
    );
    let payload: any = {
      startDate,
      endDate,
      ou: orgUnit,
      notification: false,
      persist: false
    };
    if (DHIS2_VALIDATION_RULE_CONSTANT.validationRuleGroup !== '') {
      payload = {
        ...payload,
        vrg: DHIS2_VALIDATION_RULE_CONSTANT.validationRuleGroup
      };
    }
    return payload;
  }
}
