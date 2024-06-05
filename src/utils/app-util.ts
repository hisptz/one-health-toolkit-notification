import { join, uniq, map, flattenDeep, keys } from 'lodash';
import { Dhis2dataVelueResponse } from '../models';

export class AppUtil {
  static getImportResponseValues(response: any): Dhis2dataVelueResponse {
    let conflicts = '';
    let imported = 0;
    let ignored = 0;
    let deleted = 0;
    response = response.response ?? response;
    if (response) {
      const importCount = response.importCount || {};
      if (keys(importCount).length > 0) {
        imported += importCount['imported'] ?? 0;
        imported += importCount['updated'] ?? 0;
        ignored = importCount['ignored'] ?? 0;
        deleted = importCount['deleted'] ?? 0;
        conflicts = join(
          uniq(
            flattenDeep(
              map(response.conflicts || [], (conflict) => {
                const reference = conflict.object || '';
                const value = conflict.value || '';
                return join([reference, value], ' : ');
              })
            )
          ),
          ' , '
        );
      }
    }
    return {
      imported,
      ignored,
      deleted,
      conflicts
    };
  }

  static getPaginationsFilters(response: any, pageSize: number = 25): string[] {
    const pagefilters: string[] = [];
    const pager = response.pager || {};
    const total = pager.total || pageSize;
    for (let page = 1; page <= Math.ceil(total / pageSize); page++) {
      pagefilters.push(`page=${page}&pageSize=${pageSize}`);
    }
    return flattenDeep(pagefilters);
  }

  static getFormattedDate(date: any): string {
    let dateObject = new Date(date);
    if (isNaN(dateObject.getDate())) {
      dateObject = new Date();
    }
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return (
      year +
      (month > 9 ? `-${month}` : `-0${month}`) +
      (day > 9 ? `-${day}` : `-0${day}`)
    );
  }

  static getDatesInRange(startDate: any, endDate: any): string[] {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const date = new Date(startDate.getTime());
    const dates = [];
    while (date <= endDate) {
      dates.push(this.getFormattedDate(new Date(date)));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  static uid(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const allowedChars = '0123456789' + letters;
    const NUMBER_OF_CODEPOINTS = allowedChars.length;
    const CODESIZE = 11;
    let uid;
    uid = letters.charAt(Math.random() * letters.length);
    for (let i = 1; i < CODESIZE; ++i) {
      uid += allowedChars.charAt(Math.random() * NUMBER_OF_CODEPOINTS);
    }
    return uid;
  }

  static getHttpAuthorizationHeader(
    username: string,
    password: string
  ): {
    Authorization: string;
    'Content-Type': string;
  } {
    return {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    };
  }
}
