import { appSourceConfig } from '../configs';
import {
  Dhis2OrganisationUnit,
  Dhis2ValidationRuleTriggerResponse
} from '../models';
import {
  Dhis2OrganisationUnitUtil,
  Dhis2ValidationRuleUtil,
  LogsUtil
} from '../utils';

export class ValidationRuleProcess {
  private _dhis2OrganisationUnitUtil: Dhis2OrganisationUnitUtil;
  private _dhis2ValidationRuleUtil: Dhis2ValidationRuleUtil;

  constructor() {
    this._dhis2ValidationRuleUtil = new Dhis2ValidationRuleUtil(
      appSourceConfig.username,
      appSourceConfig.password,
      appSourceConfig.baseUrl
    );
    this._dhis2OrganisationUnitUtil = new Dhis2OrganisationUnitUtil(
      appSourceConfig.username,
      appSourceConfig.password,
      appSourceConfig.baseUrl
    );
  }

  async startValidationRuleNotificationTriggerProcess() {
    try {
      await new LogsUtil().addLogs(
        'info',
        `Start of evaluation and trigger for validation rule process`,
        'Validation Rule Process'
      );
      //TODO run predictors
      const organisationUnits: Dhis2OrganisationUnit[] =
        await this._dhis2OrganisationUnitUtil.discoveringValidationRuleOrganisationUnits();
      for (const organisationUnit of organisationUnits) {
        await new LogsUtil().addLogs(
          'info',
          `Evaluate and trigger validation rule notification for ${
            organisationUnit.name ?? ''
          }`,
          'App process'
        );
        const validationRuleTriggers: Dhis2ValidationRuleTriggerResponse[] =
          await this._dhis2ValidationRuleUtil.triggerAndGetValidationRuleNotification(
            organisationUnit.id ?? ''
          );
        console.log(validationRuleTriggers);
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Validation Rule Process'
      );
    }
  }
}
