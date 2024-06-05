export interface Dhis2OrganisationUnit {
  id: string;
  name?: string;
  level: number;
  children?: Dhis2OrganisationUnit[];
}
