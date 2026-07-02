import Fuse from "fuse.js";
import Invoice from "../models/Invoice.js";

const get_matching_customer=async(customer_name)=>{

  const customers=await Invoice.distinct("customer");

  const fuse=new Fuse(customers,{
    threshold:0.35,
    ignoreLocation:true,
    minMatchCharLength:2,
  });

  const result=fuse.search(customer_name);

  if(!result.length){
    return null;
  }

  return result[0].item;

};

export {get_matching_customer};