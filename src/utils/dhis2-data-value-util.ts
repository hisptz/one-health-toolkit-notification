import { filter, chunk, join, uniq, groupBy, keys } from 'lodash';
import { AppUtil, HttpUtil, LogsUtil } from '.';
import { Dhis2DataValue, Dhis2dataVelueResponse } from '../models';

export class Dhis2DataValueUtil {
  private _url: string;
  private _headers: { 'Content-Type': string; Authorization: string };
  private _dataSyncPageSize: number = 500;

  constructor(username: string, password: string, baseUrl: string) {
    this._url = baseUrl;
    this._headers = AppUtil.getHttpAuthorizationHeader(username, password);
  }

  async getAggregatedDatavalues(
    dhis2DataValues: Dhis2DataValue[]
  ): Promise<Dhis2DataValue[]> {
    const formattedDhis2DataValues: Dhis2DataValue[] = [];
    try {
      const groupedOus = groupBy(dhis2DataValues, 'orgUnit');
      for (const orgUnit of keys(groupedOus)) {
        const groupedPeriods = groupBy(groupedOus[orgUnit], 'period');
        for (const period of keys(groupedPeriods)) {
          const groupedDataElements = groupBy(
            groupedPeriods[period],
            'dataElement'
          );
          for (const dataElement of keys(groupedDataElements)) {
            const value: any = groupedDataElements[dataElement].length ?? 0;
            formattedDhis2DataValues.push({
              dataElement,
              period,
              orgUnit,
              value
            });
          }
        }
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Dhis2DataValueUtil'
      );
    }
    return formattedDhis2DataValues;
  }

  async syncDataValues(
    dhis2DataValues: Dhis2DataValue[]
  ): Promise<Dhis2dataVelueResponse> {
    let totalImported = 0;
    let totalDeleted = 0;
    let totalIgnored = 0;
    let conflicts: string[] = [];
    if (dhis2DataValues.length > 0) {
      await new LogsUtil().addLogs(
        'info',
        `Syncing ${dhis2DataValues.length} data values to ${this._url}`,
        'Dhis2DataValueUtil'
      );
      for (const dataValues of chunk(
        filter(dhis2DataValues, (data: any) => data.value > 0),
        this._dataSyncPageSize
      )) {
        try {
          const url = `${this._url}/api/dataValueSets.json`;
          const response: any = await HttpUtil.postHttp(this._headers, url, {
            dataValues
          });
          const {
            ignored,
            imported,
            deleted,
            conflicts: conflictMessage
          } = AppUtil.getImportResponseValues(response);
          totalImported += imported;
          totalDeleted += deleted;
          totalIgnored += ignored;
          if (conflictMessage !== '') {
            conflicts.push(conflictMessage);
          }
          console.log({ imported, deleted, ignored, conflictMessage });
        } catch (error: any) {
          await new LogsUtil().addLogs(
            'error',
            error.message || error,
            'Dhis2DataValueUtil'
          );
        }
      }
    }
    return {
      imported: totalImported,
      deleted: totalDeleted,
      ignored: totalIgnored,
      conflicts: join(uniq(conflicts), ' , ')
    };
  }
}
