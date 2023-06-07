function updateAddressesToHex(data: any, list: any, settings: any) {
  let index: any = 0;
  function convertToHex(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        if (key === 'data') {
          const vlist: any = obj[key];
          obj[key] = vlist.map((v: any) => {
            let result: any = v.toString(settings.format).toUpperCase();
            switch (settings.format) {
              case 2:
                result = result.padStart(32, '0');
                break;
              case 16:
                result = '0x' + result.padStart(8, '0');
                break;
            }
            return result;
          });
        } else {
          convertToHex(obj[key]);
          if (Array.isArray(obj[key]) && key.startsWith('Index')) {
            index = 0; // Reset index after processing each "Index" object
          }
        }
      } else if (key === 'address') {
        obj[key] = '0x' + obj[key].toString(16).toUpperCase();
        obj['symbol'] = list[index].name;
        index = index + 1;
      }
    }
  }

  convertToHex(data);

  const updatedData: any = { settings: settings };
  for (const [key, values] of Object.entries(data)) {
    updatedData[key] = (values as any[]).map((item: any) => ({
      symbol: item.symbol,
      ...item
    }));
  }

  return JSON.stringify(updatedData, null, 2);
}

export const openJsonInNewWindow = (data: any, list: any, settings: any) => {
  const jsonString = updateAddressesToHex(data, list, settings);

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(`
    <button onclick="downloadJson()">Download JSON</button>
    <pre>${jsonString}</pre>
  `);
    newWindow.document.close();

    const downloadJson = () => {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.json';
      link.click();
      URL.revokeObjectURL(url);
    };

    newWindow.document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target && target.nodeName === 'BUTTON') {
        downloadJson();
      }
    });
  }
};
