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

import parse_message from "../utils/parseMessage.js";

const whatsapp_webhook=async(req,res)=>{

  const client=twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try{

    const incoming=req.body.Body?.trim();

    if(!incoming){

      res.type("text/xml");

      return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);

    }

    const {intent,customer}=await parse_message(incoming);

    let summary="";
    let invoices="";

    if(intent==="payment"){

      const report=await get_weekly_payment_schedule(customer);

      summary=format_weekly_payment_summary(report);

      invoices=format_weekly_payment_invoices(report);

    }

    else if(intent==="collection"){

      const report=await get_weekly_collection_followup(customer);

      summary=format_weekly_collection_summary(report);

      invoices=format_weekly_collection_invoices(report);

    }

    else{

      summary=`Sorry, I couldn't understand your request.

Examples:

• Payment schedule for Alpha

• Outstanding for Beta

• Collection follow up for Gamma`;

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