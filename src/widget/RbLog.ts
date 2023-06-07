function updateAddressesToHex(data: any) {
  function convertToHex(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        convertToHex(obj[key]);
      } else if (key === 'address') {
        obj[key] = '0x' + obj[key].toString(16).toUpperCase();
      }
    }
  }

  convertToHex(data);
  return JSON.stringify(data, null, 2);
}

export const openJsonInNewWindow = (data: any) => {
  const jsonString = updateAddressesToHex(data);

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
