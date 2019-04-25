const fs = require("fs");
const splitterReg = /[.。, 、,，']/g;

function parseTxt(txtPath) {
  if (!fs.existsSync(txtPath)) {
    throw new Error("File not exsit!");
  }
  const array = fs
    .readFileSync(txtPath)
    .toString()
    .split("\n");
  const [date, location, samples, ...areas] = array;
  return {
      'A': [[date]],
      'B': [[location]],
      'G': splitPlants(samples),
      ...parseAreas(areas),
  }
}

const splitPlants = plants => plants.split('，').filter(s => s.length > 0).map(x => [x]);
const findSpliter = s => {
  for (let i = 0; i < s.length; i++) {
    if (splitterReg.test(s[i])) {
      return i;
    }
  }
}
function parseAreas(areas) {
  const res = {
    'E': [],
  };
  let lastDNum = 0, lastELen = 1;
  areas.forEach((origin, index) => {
    const item = origin.replace(/\r/g, '');
    const k = /^\d/.test(item) ? 'C' : 'E';
    if (k === 'C') {
      lastDNum += index === 0 ? 0 : lastELen;
      try {
        const splitterIndex = findSpliter(item)
        res[k+lastDNum] = [[item.slice(0, splitterIndex), item.slice(splitterIndex + 1).replace(splitterReg, '')]];
      } catch(e) {
        console.log(e.message);
      }
    } else {
      const plants = splitPlants(item);
      lastELen = plants.length;
      res['E'].push(...plants);      
    }
  })
  return res;
}

module.exports= parseTxt;
