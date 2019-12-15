const fs = require("fs");
const splitterReg = /[.。, 、,，']/g;
const SAMPLE_NUM_COL = 'C';
const PLANS_COL = 'E';
const isStartWIthNum = s => /^\d/.test(s);
const isNewHouseArea = str => /\s/.test(str);
const date2Chinese = date => date.replace(splitterReg, '月') + '日';

const getMaxTypeKey = keys => {
  const numbers =  keys.map(k => parseInt(k.slice(1)));
  return Math.max(...numbers)
}

function parseTxt(txtPath, startRowNum = 0) {
  if (!fs.existsSync(txtPath)) {
    throw new Error("File not exsit!");
  }
  const arrays = fs
    .readFileSync(txtPath)
    .toString()
    .split("\n")
    .filter(s => s.length > 0);

  const dataArrs = arrays.reduce((resArr, item) => {
    if (isNewHouseArea(item)) {
      resArr.push([item])
    } else {
      resArr[resArr.length - 1].push(item)
    }
    return resArr;
  }, [])
  const dataObj = dataArrs.reduce((obj, array) =>
    Object.assign(obj, parseSingleArea(array, obj.nextStartRow)), { nextStartRow: startRowNum }
  );
  delete dataObj.nextStartRow;
  return dataObj;
}

function parseSingleArea(array, startRowNum = 0) {
  // date A
  // location B
  // sampes G optional
  const [dateLocation, samples, ...areas] = array;
  const res = {}
  const [date, location] = dateLocation.split(' ');
  const chineseDate = date2Chinese(date);
  res[`A${startRowNum}`] = [[chineseDate, location]];
  const hasSamples = !isStartWIthNum(samples)
  let GMax = 0;
  if (hasSamples) {
    const demoPlants = splitPlants(samples)
    res[`G${startRowNum}`] = demoPlants;
    GMax = demoPlants.length - 1;
  }
  

  Object.assign(res, parseAreas(hasSamples ? areas : [samples, ...areas], startRowNum));
  // find endRowNum
  const CMax = getMaxTypeKey(Object.keys(res).filter(s => s.includes('C')));
  const EMax =  `E${CMax}` in res ? res[`E${CMax}`].length + CMax -1 : CMax;
  const maxRows = Math.max(GMax, CMax, EMax);
  // 小区之间加一个空行
  res['nextStartRow'] = maxRows + 2;
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
  const res = {};
  let lastDNum = startRowNum, step = 1;
  areas.forEach((origin, index) => {
    
    const item = origin.replace(/\r/g, '');
    // column C & D
    if (isStartWIthNum(item)) {
      lastDNum += index === 0 ? 0 : step;
      step = 1;
      try {
        const splitterIndex = findSpliter(item);
        res[`${SAMPLE_NUM_COL}${lastDNum}`] = [[parseInt(item.slice(0, splitterIndex), 10), item.slice(splitterIndex + 1).replace(splitterReg, '')]];
      } catch(e) {
        console.log(e);
      }
    } else {
      // column E
      const plants = splitPlants(item);
      step = plants.length;
      const key = `${PLANS_COL}${lastDNum}`;
      res[key] = plants;      
    }
  })
  return res;
}

module.exports= parseTxt;
 