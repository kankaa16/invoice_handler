import Invoice from "../models/Invoice.js";
import { getBucket } from "../utils/bucket.js";

import {startOfWeek,addDays,isWithinInterval,isBefore} from "date-fns";

const get_weekly_payment_schedule=async(customer_name)=>{

  const invoices=await Invoice.find({
    customer:{
      $regex:customer_name,
      $options:"i",
    },
  }).sort({dueDate:1});

  if(!invoices.length){
    throw new Error("Invalid customer!!!");
  }

  const today=new Date();

  const monday=startOfWeek(today,{
    weekStartsOn:1,
  });

  const friday=addDays(monday,4);

  let overdue_amount=0;
  let due_this_week=0;
  let total_outstanding=0;

  const ageing={
    "90+":0,
    "61-90":0,
    "31-60":0,
    "16-30":0,
    "0-15":0,
    "Not Due":0,
    "No-Due-Date-Given":0,
  };

  invoices.forEach((invoice)=>{

    const outstanding=Number(invoice.outstanding);

    total_outstanding+=outstanding;

    if(!invoice.dueDate){
      ageing["No-Due-Date-Given"]+=outstanding;
      return;
    }

    const due=new Date(invoice.dueDate);

    if(isBefore(due,today)){
      overdue_amount+=outstanding;
    }

    if(isWithinInterval(due,{
      start:monday,
      end:friday,
    })){
      due_this_week+=outstanding;
    }

    const bucket=getBucket(invoice.dueDate);

    if(ageing[bucket]!==undefined){
        ageing[bucket]+=outstanding;
    }

  });

  const round=(num)=>Number(num.toFixed(2));

  return{
    customer:invoices[0].customer,
    spoc:invoices[0].spoc,
    overdue_amount:round(overdue_amount),
    due_this_week:round(due_this_week),
    total_outstanding:round(total_outstanding),
    ageing,
    invoices:invoices.map((invoice)=>({
      invoice_no:invoice.invoiceNo,
      due_date:invoice.dueDate,
      outstanding:invoice.outstanding,
    })),
  };

};

export {get_weekly_payment_schedule};