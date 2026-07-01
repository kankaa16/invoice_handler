import XLSX from "xlsx";


//parsing the pdf
const parseExcel=(filePath) => {
  const extracted=XLSX.readFile(filePath);

  const sheetName=extracted.SheetNames[0];

  const sheet=extracted.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(sheet); //return in json only
};

export default parseExcel;