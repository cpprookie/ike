const XLSX = require('xlsx');
const parseTxt = require('./parseTxt');
const path = require('path');

function getNextRow(ws) {
    // empty ws condition start from 0
    const {s, e} = XLSX.utils.decode_range(workSheet['!ref']);
    return e.r + 2;
}

function insertRow(ws, txtObj, rowNumber) {
    console.log(txtObj);
    const keys = Object.keys(txtObj);
    keys.forEach(key => {
        const origin = key[0] + (key.length > 1 ? (parseInt(key.slice(1)) + rowNumber) : rowNumber);
        XLSX.utils.sheet_add_aoa(ws, txtObj[key], { origin });
    })
    XLSX.writeFile(workbook, 'abc.xlsx')
}

// init workSheet
const workbook = XLSX.readFile(path.join(__dirname, 'test.xlsx'));
const firstSheetName = workbook.SheetNames[0];
console.log(firstSheetName);
const workSheet = workbook.Sheets[firstSheetName];
console.log(workSheet);
const txt2aoa = parseTxt(path.join(__dirname, 'ke.txt'));
// console.log(txt2aoa);
const nextRow = getNextRow(workSheet);
insertRow(workSheet, txt2aoa, nextRow);
