//modules
import type { StatusResponse, UnknownNest } from '@stackpress/lib/types';

//these are types from papaparse
export type CSVParseError = {
  code: string,
  message: string,
  row: number,
  type: string,
  errors?: Record<string, any>
};

export type CSVParseResults = { 
  data: Record<string, any>[],
  errors: CSVParseError[]
};

//these are types returned from the batch send endpoint
export type BatchSendResults<
  M extends UnknownNest = UnknownNest
> = Partial<StatusResponse<Partial<M>>>[];

export type BatchSendResponse<
  M extends UnknownNest = UnknownNest
> = StatusResponse<BatchSendResults<M>>;

export class ErrorWithErrors<E> extends Error {
  public code = 400;
  public status = 'Bad Request';
  public errors: E;
  constructor(message: string, errors: E) {
    super(message);
    this.errors = errors;
  }
}

export async function csvToFormData(file: File): Promise<FormData> {
  //cjs import
  const papaparse = await import('papaparse').then(m => m.default);
  return await new Promise((resolve, reject) => {
    //@ts-ignore - type 'File' is not assignable to parameter 
    //of type 'unique symbol', but it still works...
    papaparse.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: CSVParseResults) => {
        //notify of errors
        if (results.errors.length) {
          reject(new ErrorWithErrors('CSV parsing error', results.errors));
          return;
        }
        //create form data
        const data = new FormData();
        for (let i = 0; i < results.data.length; i++) {
          for (const [ key, value ] of Object.entries(results.data[i])) {
            data.append(`rows[${i}][${key}]`, value.toString());
          }
        }
        resolve(data);
      }
    });
  });
}

export function batchImportSend<M extends UnknownNest = UnknownNest>(
  url: string, 
  token: string, 
  data: FormData
): Promise<BatchSendResults<M>> {
  return new Promise((resolve, reject) => {
    const payload = {
      method: 'POST',
      body: data,
      headers: { 'Authorization': token }
    };
    fetch(url, payload)
      .then(response => response.json())
      .then((response: BatchSendResponse<M>) => {
        //if OK and results is an array, resolve with results
        if (response.code === 200 && Array.isArray(response.results)) {
          resolve(response.results);
          return;
        //if OK but no results, resolve with empty array
        } else if (response.code === 200) {
          resolve([]);
          return;
        //if not OK and results is an array, reject with errors
        } else if (Array.isArray(response.results)) {
          const errors: CSVParseError[] = [];
          response.results.forEach((row, index) => {
            errors.push({
              code: String(row.code || 400),
              message: row.error || 'Unknown error',
              row: index,
              type: 'FieldMismatch',
              errors: row.errors
            })
          })
          reject(new ErrorWithErrors(
            response.error || 'Batch import failed with some errors',
            errors
          ));
          return;
        }
        reject(new ErrorWithErrors(
          response.error || 'Unknown error', 
          []
        ));
      });
  });
}

export function batchAndSend(
  url: string, 
  token: string, 
  file: File,
  notify?: (type: string, message: string) => void
) {
  notify = notify || (() => {});
  //proceed to parse
  return new Promise<boolean>(resolve => {
    csvToFormData(file)
      .then(data => batchImportSend(url, token, data))
      .then(() => resolve(true))
      .catch((e: ErrorWithErrors<CSVParseError[]>) => {
        const errors = e.errors || [];
        errors.forEach(error => {
          const errors = Object.entries(error.errors || {});
          const message = [ 
            `ROW ${error.row}: ${e.message}`, 
            ...errors.map(([ key, error ]) => `${key}: ${error}`)
          ];
          notify('error', message.join(' - '));
        });
        resolve(false);
      });
    });
}