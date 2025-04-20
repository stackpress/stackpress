//stackpress
import type { StatusResponse, UnknownNest } from '@stackpress/lib/types';
//view

export type CSVParseError = {
  code: string,
  message: string,
  row: number,
  type: string
};

export type CSVParseResults = { 
  data: Record<string, any>[],
  errors: CSVParseError[]
};

export type BatchSendResults<
  M extends UnknownNest = UnknownNest
> = Partial<StatusResponse<Partial<M>>>[];

export type BatchSendResponse<
  M extends UnknownNest = UnknownNest
> = StatusResponse<BatchSendResults<M>>;

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
          reject(results.errors);
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

export function batchImportSend<
  M extends UnknownNest = UnknownNest
>(url: string, token: string, data: FormData): Promise<BatchSendResults<M>> {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      body: data,
      headers: { 'Authorization': token }
    }).then(response => {
      response.json().then((response: BatchSendResponse<M>) => {
        if (response.code === 200) {
          resolve(response.results as BatchSendResults<M>);
          return;
        } else if (response.results) {
          reject(response.results as BatchSendResults<M>);
          return;
        } else if (response.error) {
          reject(new Error(response.error));
          return;
        }
        reject(new Error('Unknown error'));
      });
    });
  });
}

export async function batchAndSend(
  url: string, 
  token: string, 
  file: File,
  notify?: (type: string, message: string) => void
) {
  notify = notify || (() => {});
  //proceed to parse
  csvToFormData(file).then(data => {
    //send data up
    batchImportSend(url, token, data).then(() => {
      window.location.reload();
    }).catch(error => {
      if (Array.isArray(error)) {
        (error as BatchSendResults).forEach((error, i) => {
          const errors = error.errors 
            ? Object.entries(error.errors).map(
              error => `${error[0]}: ${error[1]}`
            )
            : [];
          notify('error', [
            `ROW ${i}: ${error.error}`,
            ...errors
          ].join(' - '));
        });
        return;
      }
      notify('error', error.message);
    });
  }).catch((errors: CSVParseError[]) => {
    errors.forEach(
      error => notify('error', `ROW ${error.row}: ${error.message}`)
    );
  });
}