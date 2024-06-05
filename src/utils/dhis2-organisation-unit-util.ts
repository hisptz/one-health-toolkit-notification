import { flattenDeep } from 'lodash';
import { AppUtil, HttpUtil } from '.';
import { Dhis2OrganisationUnit } from '../models';
import { DHIS2_ORGANISATION_UNIT_CONSTANT } from '../configs';

export class Dhis2OrganisationUnitUtil {
  private _url: string;
  private _headers: { 'Content-Type': string; Authorization: string };

  constructor(username: string, password: string, baseUrl: string) {
    this._url = baseUrl;
    this._headers = AppUtil.getHttpAuthorizationHeader(username, password);
  }

  async discoveringValidationRuleOrganisationUnits(): Promise<
    Dhis2OrganisationUnit[]
  > {
    const organisationUnits: Dhis2OrganisationUnit[] = [];
    const level = DHIS2_ORGANISATION_UNIT_CONSTANT.validationRuleOuLevel || 1;
    const fields = `fields=id,name`;
    const filters = `filter=level:eq:${level}`;
    const apiUrl = `${this._url}/api/organisationUnits.json?paging=false&${fields}&${filters}`;
    const response: any = await HttpUtil.getHttp(this._headers, apiUrl);
    organisationUnits.push(response.organisationUnits || []);
    return flattenDeep(organisationUnits);
  }
}
