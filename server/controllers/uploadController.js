import Invoice from "../models/Invoice.js";
import parseExcel from "../services/excelService.js";
import {datecorrector} from "../utils/date.js";

const upload_sheet=async(req,res)=>{
  try {
    if (!req.file){
      return res.status(400).json({
        message: "No file uploaded! pls upload smth",
      });
    }

    const rows=parseExcel(req.file.path);

    console.log(rows[0]);
    console.log(typeof rows[0]["Due Date"]);

    console.log(datecorrector(46206));

    const invoices=rows.map((row) => ({
      customer: row.Customer,
      spoc: row.SPOC,
      invoiceNo: row["Invoice No"],
      invoiceDate: datecorrector(row["Invoice Date"]),
      dueDate: datecorrector(row["Due Date"]),
      invoiceAmount: row["Inv Amount"],
      received: row.Received || 0,
      outstanding: row.Outstanding,
    }));

    await Invoice.deleteMany({});

    await Invoice.insertMany(invoices);

    res.json({
      success: true,
      imported: invoices.length,
    });
  } 
  catch(err){
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export {upload_sheet};