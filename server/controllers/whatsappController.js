import twilio from "twilio";

import {
  get_weekly_payment_schedule,
  get_weekly_collection_followup,
} from "../services/reportService.js";

import {
  format_weekly_payment_summary,
  format_weekly_payment_invoices,
  format_weekly_collection_summary,
  format_weekly_collection_invoices,
} from "../services/whatsappFormatter.js";



const whatsapp_webhook=async(req,res)=>{

    const client=twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

console.log(process.env.TWILIO_ACCOUNT_SID);
  console.log(process.env.TWILIO_AUTH_TOKEN ? "AUTH TOKEN FOUND" : "AUTH TOKEN MISSING");

  console.log("===== WEBHOOK HIT =====");
  console.log(req.body);

  try{

    const incoming=req.body.Body?.trim();

    if(!incoming){

      res.type("text/xml");

      return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);

    }

    const lower=incoming.toLowerCase();

    let summary="";
    let invoices="";

    if(lower.includes("weekly payment schedule")){

      const customer=incoming
        .replace(/give me a weekly payment schedule for/i,"")
        .trim();

      const report=await get_weekly_payment_schedule(customer);

      summary=format_weekly_payment_summary(report);

      invoices=format_weekly_payment_invoices(report);

    }

    else if(lower.includes("weekly collection follow-up")){

      const customer=incoming
        .replace(/give me a weekly collection follow-up for/i,"")
        .trim();

      const report=await get_weekly_collection_followup(customer);

      summary=format_weekly_collection_summary(report);

      invoices=format_weekly_collection_invoices(report);

    }

    else{

      summary=`Supported commands:

Give me a weekly payment schedule for <customer>

Give me a weekly collection follow-up for <customer>`;

    }

    await client.messages.create({
      from:process.env.TWILIO_WHATSAPP_NUMBER,
      to:req.body.From,
      body:summary,
    });

    if(invoices){

      await client.messages.create({
        from:process.env.TWILIO_WHATSAPP_NUMBER,
        to:req.body.From,
        body:invoices,
      });

    }

    res.type("text/xml");

    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);

  }

  catch(err){

    console.error(err);

    await client.messages.create({
      from:process.env.TWILIO_WHATSAPP_NUMBER,
      to:req.body.From,
      body:err.message,
    });

    res.type("text/xml");

    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);

  }

};

export {whatsapp_webhook};