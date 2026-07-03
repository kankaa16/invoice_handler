import{format_weekly_payment_summary,format_weekly_collection_summary} from "../services/whatsappFormatter.js";

import{get_weekly_payment_schedule,get_weekly_collection_followup}from "../services/reportService.js";

const weekly_payment_schedule=async(req,res)=>{

  try{
    
    const report=await get_weekly_payment_schedule(
      req.params.customer
    );

    const message=format_weekly_payment_summary(report);

    res.status(200).json({
      success:true,
      report,
      message,
    });

  }

  catch(err){

    res.status(404).json({
      success:false,
      message:err.message,
    });

  }

};

const weekly_collection_followup=async(req,res)=>{

  try{

    const report=await get_weekly_collection_followup(
      req.params.customer
    );

    const message=format_weekly_collection_summary(report);

    res.status(200).json({
      success:true,
      report,
      message,
    });

  }

  catch(err){

    res.status(404).json({
      success:false,
      message:err.message,
    });

  }

};

export{
  weekly_payment_schedule,
  weekly_collection_followup,
};