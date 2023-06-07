import { requestAPI } from '../handler';

interface ISymbol {
  name: any;
  address: any;
  length: any;
}

interface IWatchList {
  id: any;
  name: any;
  symbols: ISymbol[];
  settings: any;
}

let sample_watch_list: IWatchList[] = [
  {
    id: 'ce63eb61-ae5b-4e7d-96f9-77242f1e6421',
    name: 'my list 1',
    symbols: [
      {
        name: 'A0_DS',
        address: 'D600',
        length: 1
      },
      {
        name: 'A1_DS',
        address: 'D601',
        length: 1
      }
    ],
    settings: {
      mode: 'Master',
      format: 10,
      auto_refresh: 0
    }
  },
  {
    id: 'ce63eb61-ae5b-4e7d-96f9-77242f1e6422',
    name: 'my list 2',
    symbols: [
      {
        name: 'A0_DS',
        address: 'D600',
        length: 1
      },
      {
        name: 'A1_DS',
        address: 'D601',
        length: 1
      },
      {
        name: 'A3_DS',
        address: 'D603',
        length: 1
      },
      {
        name: 'A4_DS',
        address: 'D604',
        length: 1
      }
    ],
    settings: {
      mode: 'Slave',
      format: 2,
      auto_refresh: 1000
    }
  }
];

export async function updateWatch(content: any): Promise<any> {
  console.log('API1:', content);
  return new Promise((resolve, reject) => {
    const watchIndex = sample_watch_list.findIndex(
      (w: any) => w.id === content.id
    );
    if (watchIndex !== -1) {
      sample_watch_list[watchIndex] = { ...content }; // Update the properties of the object in sample_watch_list
    }
    console.log('API:', sample_watch_list[watchIndex]);
    resolve(sample_watch_list);
  });
}

export async function setWatchList(content: any): Promise<any> {
  sample_watch_list = content;
  return new Promise((resolve, reject) => {
    resolve(sample_watch_list);
  });
}

export async function getWatchList(): Promise<any> {
  return new Promise((resolve, reject) => {
    resolve(sample_watch_list);
  });
}

export async function ReadRAM(data: any, sse: any): Promise<Number[]> {
  var dataToSend = {
    command: 'read',
    sse: sse,
    data: data
  };

  try {
    const reply = await requestAPI<any>('ram-backdoor', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    });

    let value = reply['data'];
    return Promise.resolve(value);
  } catch (e) {
    console.error(`Error on POST ${dataToSend}.\n${e}`);
    return Promise.reject((e as Error).message);
  }
}

export async function WriteRegisters(
  data: any,
  sse: any
): Promise<string | undefined> {
  var dataToSend = {
    command: 'write',
    sse: sse,
    data: data
  };

  try {
    const reply = await requestAPI<any>('register', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    });

    let value = reply['data'];
    return Promise.resolve(value);
  } catch (e) {
    console.error(`Error on POST ${dataToSend}.\n${e}`);
    return Promise.reject((e as Error).message);
  }
}

export async function TerminateSSE(): Promise<string | undefined> {
  var dataToSend = {
    command: 'terminate'
  };

  try {
    const reply = await requestAPI<any>('ram-backdoor', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    });

    return Promise.resolve(reply);
  } catch (e) {
    console.error(`Error on POST ${dataToSend}.\n${e}`);
    return Promise.reject((e as Error).message);
  }
}

export async function GetSymbolTable(packrat: any): Promise<[]> {
  let url: any = `?query=table&packrat=${packrat.toString()}`;
  try {
    const reply = await requestAPI<any>('ram-backdoor' + url);

    const resultArray: any = [];

    for (const key in reply) {
      if (reply.hasOwnProperty(key)) {
        const obj = {
          name: key,
          address: reply[key],
          search: reply[key] + ' - ' + key
        };
        resultArray.push(obj);
      }
    }

    return Promise.resolve(resultArray);
  } catch (e) {
    return Promise.reject((e as Error).message);
  }
}
