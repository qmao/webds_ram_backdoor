import { requestAPI, settingRegistry} from './local_exports';

const plugin = "@webds/ram_backdoor:plugin"

const loadExtensionSettings = async() => {
	async function load() {
		if (settingRegistry) {
			try {
				var s = await settingRegistry.load(plugin);
				if (s != null) {
					var value = s.composite["watchList"];
				}
				return value;

			} catch (reason) {
				console.error(`Failed to set settings for ${plugin}\n${reason}`);
			}
		}
		return [];
	};
	return await load();
};

interface ISettingElement {
  name: string;
  value: any;
}

const setExtensionSettings = (elements: ISettingElement[]) => {
	if (settingRegistry) {
		try {
			elements.forEach(async function (item) {
				console.log("AAAAAAAAA1....1", item.name, item.value)
				await settingRegistry.set(plugin, item.name, item.value);
			});
		} catch (reason) {
			console.error(`Failed to set settings for ${plugin}\n${reason}`);
		}
		return loadExtensionSettings();
	}
	return [];
};

export async function updateWatch(content: any) {

	let sample_watch_list: any = await getWatchList()

    const watchIndex = sample_watch_list.findIndex(
      (w: any) => w.id === content.id
    );
    if (watchIndex !== -1) {
      sample_watch_list[watchIndex] = { ...content };
    }
	setExtensionSettings([{"name": "watchList", "value": sample_watch_list}])
    return sample_watch_list;
}

export function setWatchList(content: any) {
  setExtensionSettings([{"name": "watchList", "value": content}])
}

export async function getWatchList() {
  let items: any = await loadExtensionSettings();
  
  return items;
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
