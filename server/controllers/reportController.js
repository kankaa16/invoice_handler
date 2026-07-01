import {get_weekly_payment_schedule} from "../services/reportService.js";

const weekly_payment_schedule=async(req,res)=>{

  try{

    const report=await get_weekly_payment_schedule(
      req.params.customer
    );

    res.status(200).json({
      success:true,
      report,
    });

  }

  catch(err){

    res.status(404).json({
      success:false,
      message:err.message,
    });

  }

};

export {weekly_payment_schedule};