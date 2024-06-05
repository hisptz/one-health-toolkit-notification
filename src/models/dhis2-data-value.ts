export interface Dhis2DataValue {
  dataElement: string;
  period: string;
  orgUnit: string;
  categoryOptionCombo?: string;
  value: string | number;
}
