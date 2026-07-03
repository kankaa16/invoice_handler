import XLSX from "xlsx";

export const datecorrector=(value)=>{
  if (!value) return null;

  if (typeof value==="number") {
    const d=XLSX.SSF.parse_date_code(value);
    return new Date(d.y, d.m-1, d.d);
  }

  return new Date(value);
};