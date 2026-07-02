import Invoice from "../models/Invoice.js";
import { getBucket } from "../utils/bucket.js";
import {get_matching_customer} from "../utils/fuzzySearch.js";
import {startOfWeek,addDays,isWithinInterval,isBefore} from "date-fns";

const get_weekly_payment_schedule=async(customer_name)=>{

  const customer=await get_matching_customer(customer_name);

  if(!customer){
  throw new Error("Customer not found");
  }

  const invoices=await Invoice.find({
    customer,
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

const get_weekly_collection_followup=async(customer_name)=>{

  const invoices=await Invoice.find({
    customer:{
      $regex:customer_name,
      $options:"i",
    },
  }).sort({dueDate:1});

  if(!invoices.length){
    throw new Error("Customer not found");
  }

  const today=new Date();

  const monday=startOfWeek(today,{
    weekStartsOn:1,
  });

  const friday=addDays(monday,4);

  let overdue_amount=0;
  let due_this_week=0;
  let total_collection_target=0;

  const days={
    Overdue_As_Of_Monday:0,
    Monday:0,
    Tuesday:0,
    Wednesday:0,
    Thursday:0,
    Friday:0,
  };

  invoices.forEach((invoice)=>{

    if(!invoice.dueDate){
      return;
    }

    const outstanding=Number(invoice.outstanding);

    const due=new Date(invoice.dueDate);

    // overdue as of today
    if(isBefore(due,today)){
      overdue_amount+=outstanding;
    }

    // overdue before this week started
    if(isBefore(due,monday)){
      days.Overdue_As_Of_Monday+=outstanding;
    }

    // total target till friday
    if(due<=friday){
      total_collection_target+=outstanding;
    }

    // invoices due this week
    if(isWithinInterval(due,{
      start:monday,
      end:friday,
    })){

      due_this_week+=outstanding;

      const diff=Math.floor(
        (due-monday)/(1000*60*60*24)
      );

      switch(diff){

        case 0:
          days.Monday+=outstanding;
          break;

        case 1:
          days.Tuesday+=outstanding;
          break;

        case 2:
          days.Wednesday+=outstanding;
          break;

        case 3:
          days.Thursday+=outstanding;
          break;

        case 4:
          days.Friday+=outstanding;
          break;

      }

    }

  });

  const round=(num)=>Number(num.toFixed(2));

  Object.keys(days).forEach((day)=>{
    days[day]=round(days[day]);
  });

  return{

    customer:invoices[0].customer,

    spoc:invoices[0].spoc,

    week_start:monday,

    week_end:friday,

    overdue_amount:round(overdue_amount),

    due_this_week:round(due_this_week),

    total_collection_target:round(total_collection_target),

    day_wise:days,

    invoices:invoices.map((invoice)=>({

      invoice_no:invoice.invoiceNo,

      due_date:invoice.dueDate,

      outstanding:round(invoice.outstanding),

    })),

  };

};

export {get_weekly_payment_schedule, get_weekly_collection_followup};