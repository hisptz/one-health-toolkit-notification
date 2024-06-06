import { AppConfigModel } from '../models';

export const appSourceConfig: AppConfigModel = {
  username: 'dhis_username',
  password: 'dhis_password',
  baseUrl: 'dhis_base_url'
};

export const DHIS2_ORGANISATION_UNIT_CONSTANT = {
  validationRuleOuLevel: 1 // level for ous used for organunits, ouId will be fetched by level
};

export const DHIS2_VALIDATION_RULE_CONSTANT = {
  validationRuleGroup: '', // id for validation rul group for the notifications
  defaultNumberOfMonth: 2 // number of month including current month get end date
};
