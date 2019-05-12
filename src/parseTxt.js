const fs = require("fs");
const splitterReg = /[.。, 、,，']/g;
const SAMPLE_NUM_COL = 'C';
const PLANS_COL = 'E';
const isStartWIthNum = s => /^\d/.test(s);
const isNewHouseArea = s => isStartWIthNum(s) && (s.includes('月') || s.includes('日'));

function parseTxt(txtPath) {
  if (!fs.existsSync(txtPath)) {
    throw new Error("File not exsit!");
  }
  const arrays = fs
    .readFileSync(txtPath)
    .toString()
    .split("\n");
  let lastRow = 0;
  const dataArrs = arrays.reduce((resArr, item) => {
    if (isNewHouseArea(item)) {
      resArr.push([item])
    } else {
      resArr[resArr.length - 1].push(item)
    }
    return resArr;
  }, [])
  const dataObj = dataArrs.reduce((obj, array) =>
    Object.assign(obj, parseSingleArea(array, obj.nextStartRow)), { nextStartRow: 0 }
  );
  delete dataObj.nextStartRow;
  return dataObj;
}

function parseSingleArea(array, startRowNum = 0) {
  // date A
  // location B
  // sampes G
  const [date, location, samples, ...areas] = array;
  const res = {}
  res[`A${startRowNum}`] = [[date]];
  res[`B${startRowNum}`] = [[location]];
  res[`G${startRowNum}`] = splitPlants(samples);
  Object.assign(res, parseAreas(areas, startRowNum));
  // find endRowNum
  const maxRows = Math.max(...Object.keys(res).filter(k => k.includes(PLANS_COL || 'G')).map(p => parseInt(p.slice(1)) + res[p].length));
  res['nextStartRow'] = maxRows + 1;
  return res;
}

const splitPlants = plants => plants.split('，').filter(s => s.length > 0).map(x => [x]);
const findSpliter = s => {
  for (let i = 0; i < s.length; i++) {
    if (splitterReg.test(s[i])) {
      return i;
    }
  }
}

function parseAreas(areas, startRowNum) {
  // 标号为0的样方无植物时，E列从编号1开始
  const plantOriginKey = isStartWIthNum(areas[1]) ? `${PLANS_COL}${1+startRowNum}` : `${PLANS_COL}${startRowNum}`;
  const res = {};
  res[plantOriginKey] = [];
  let lastDNum = 0, lastELen = 1;
  areas.forEach((origin, index) => {
    const item = origin.replace(/\r/g, '');
    // column C & D
    if (isStartWIthNum(item)) {
      lastDNum += index === 0 ? 0 : lastELen;
      try {
        const splitterIndex = findSpliter(item);
        res[SAMPLE_NUM_COL+ (lastDNum + startRowNum)] = [[parseInt(item.slice(0, splitterIndex), 10), item.slice(splitterIndex + 1).replace(splitterReg, '')]];
      } catch(e) {
        console.log(e);
      }
    } else {
      // column E
      const plants = splitPlants(item);
      lastELen = plants.length;
      res[plantOriginKey].push(...plants);      
    }
  })
  return res;
}

module.exports= parseTxt;
