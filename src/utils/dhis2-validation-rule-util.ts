import { filter, flattenDeep, map, toLower } from 'lodash';
import { AppUtil, HttpUtil, LogsUtil } from '.';
import {
  DHIS2_NOTIFICATION_MAPPING_CONSTANT,
  DHIS2_VALIDATION_RULE_CONSTANT
} from '../configs';
import {
  Dhis2DataValue,
  Dhis2NotificationMapping,
  Dhis2ValidationRuleTriggerResponse
} from '../models';

export class Dhis2ValidationRuleUtil {
  private _url: string;
  private _headers: { 'Content-Type': string; Authorization: string };

  constructor(username: string, password: string, baseUrl: string) {
    this._url = baseUrl;
    this._headers = AppUtil.getHttpAuthorizationHeader(username, password);
  }

  async getTransformedMessageConversationsToDataValues(
    validationRuleTriggers: Dhis2ValidationRuleTriggerResponse[]
  ): Promise<Dhis2DataValue[]> {
    const dhis2DataValues: Dhis2DataValue[] = [];
    try {
      const notificationMappings: Dhis2NotificationMapping[] = filter(
        DHIS2_NOTIFICATION_MAPPING_CONSTANT,
        (config: Dhis2NotificationMapping) =>
          config.notificationSubjectPattern === ''
      );
      for (const validationRuleTrigger of validationRuleTriggers) {
        const { periodId, organisationUnitId, validationRuleDescription } =
          validationRuleTrigger;
        for (const notificationMapping of notificationMappings) {
          const { dataElement, diseasePattern } = notificationMapping;
          if (
            toLower(validationRuleDescription).includes(toLower(diseasePattern))
          ) {
            dhis2DataValues.push({
              dataElement,
              period: periodId,
              orgUnit: organisationUnitId,
              value: 1
            });
          }
        }
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Dhis2MessageConversationsUtil'
      );
    }
    return flattenDeep(dhis2DataValues);
  }

  async triggerAndGetValidationRuleNotification(
    orgUnit: string,
    startDate: string,
    endDate: string
  ): Promise<Dhis2ValidationRuleTriggerResponse[]> {
    let validationRuleTriggers: Dhis2ValidationRuleTriggerResponse[] = [];
    try {
      const payloads: any = this._getValidationRuleNotificationPayload(
        orgUnit,
        startDate,
        endDate
      );
      for (const payload of payloads) {
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
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Dhis2ValidationRuleUtil'
      );
    }
    return flattenDeep(validationRuleTriggers);
  }

  private _getValidationRuleNotificationPayload(
    orgUnit: string,
    startDate: string,
    endDate: string
  ): any[] {
    const payloads: any[] = [];
    let defaultPayload: any = {
      startDate,
      endDate,
      ou: orgUnit,
      notification: true,
      persist: false
    };
    if (DHIS2_VALIDATION_RULE_CONSTANT.validationRuleGroups.length > 0) {
      for (const vrg of DHIS2_VALIDATION_RULE_CONSTANT.validationRuleGroups) {
        payloads.push({
          ...defaultPayload,
          vrg
        });
      }
    } else {
      payloads.push(defaultPayload);
    }
    return flattenDeep(payloads);
  }
}
