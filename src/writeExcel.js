const XLSX = require('xlsx');
const parseTxt = require('./parseTxt');
const path = require('path');

function initEmptyWorkSheet() {
    const wb = XLSX.utils.book_new();
    const wsName = "survey1";
    /* make worksheet */
    const wsData = [['日期', '小区名称', '样方编号', '生境', '名称', '是否开花', '样方旁种植植物']];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    /* Add the worksheet to the workbook */
    XLSX.utils.book_append_sheet(wb, ws, wsName);
    return { wb, ws };
}

function getFileName() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `survey_${month}_${day}.xlsx`;
}

function getNextRow(ws) {
    // empty ws condition start from 0
    const {e} = XLSX.utils.decode_range(ws['!ref']);
    return e.r + 2;
}

function writeContent(wb, ws, fileName, txtObj) {
    const keys = Object.keys(txtObj);
    keys.forEach(key => {
        // const origin = key[0] + (key.length > 1 ? (parseInt(key.slice(1)) + rowNumber) : rowNumber);
        XLSX.utils.sheet_add_aoa(ws, txtObj[key], { origin: key });
    })
    XLSX.writeFile(wb, fileName);
    console.log('success！')
}

function writeExcel(txtPath) {
    const { wb, ws } = initEmptyWorkSheet();
    const contentRow = getNextRow(ws);
    const fileName = getFileName();
    const txt2aoa = parseTxt(txtPath, contentRow);
    writeContent(wb, ws, fileName, txt2aoa);
}

// run main thread
try {
    const txtPath = path.join(__dirname, 'ke.txt')
    writeExcel(txtPath);
} catch(e) {
    console.error(e);
}
