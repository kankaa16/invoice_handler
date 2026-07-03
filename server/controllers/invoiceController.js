import Invoice from "../models/Invoice.js";
import {getBucket} from "../utils/bucket.js";

const getInvoices=async(req,res)=>{
  try{
    const invoices=await Invoice.find();
    const due=invoices.map((invoice)=>({
        ...invoice.toObject(), 
        bucket:getBucket(invoice.dueDate)
    }))

    res.status(200).json({
        success:true,
        count:invoices.length,
        invoices:due,
    });
  }
  catch(err){
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export {getInvoices};