import { AppConfigModel, Dhis2NotificationMapping } from '../models';

export const appSourceConfig: AppConfigModel = {
  username: 'dhis_username',
  password: 'dhis_password',
  baseUrl: 'dhis_base_url'
};

export const DHIS2_ORGANISATION_UNIT_CONSTANT = {
  validationRuleOuLevel: 1 // level for ous used for organunits, ouId will be fetched by level
};

export const DHIS2_PREDICTOR_CONSTANT = {
  predictorGroups: [] // ids for predictors group
};

export const DHIS2_VALIDATION_RULE_CONSTANT = {
  validationRuleGroups: [], // ids for validation rule group for the notifications
  defaultNumberOfDays: 2 // number of month including current month get end date
};

export const DHIS2_MESSAGE_CONVERSATION_CONSTANT = {
  caseIdReference: '', //Case Id Prefix from notification template eg: caseIdReference: 'Event ID:',
  program: '', // program id reference
  filterAttribute: '' // attributes to filtrs
};

export const DHIS2_NOTIFICATION_MAPPING_CONSTANT: Dhis2NotificationMapping[] = [
  {
    dataElement: '', // ID for data element
    notificationSubjectPattern: '', // notification's subject pattern from subject
    diseasePattern: '' // disease pattern from subject
  }
];
