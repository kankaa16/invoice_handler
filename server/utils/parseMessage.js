import Fuse from "fuse.js";
import Invoice from "../models/Invoice.js";

const PAYMENT_KEYWORDS=[
  "payment",
  "schedule",
  "remaining",
  "outstanding",
  "pending",
  "due",
];

const COLLECTION_KEYWORDS=[
  "collection",
  "follow",
  "followup",
  "follow-up",
  "collect",
];

const normalize=(text)=>{

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\b(private|limited|pvt|ltd|customer|co|llc)\b/g,"")
    .replace(/\s+/g," ")
    .trim();

};

const parse_message=async(message)=>{

  const lower=message.toLowerCase();

  let payment_score=0;
  let collection_score=0;

  PAYMENT_KEYWORDS.forEach((word)=>{
    if(lower.includes(word)) payment_score++;
  });

  COLLECTION_KEYWORDS.forEach((word)=>{
    if(lower.includes(word)) collection_score++;
  });

  const intent=
    payment_score>=collection_score
      ? "payment"
      : "collection";

  const customers=await Invoice.distinct("customer");

  const normalized_message=normalize(message);

  //direct match found
  for(const customer of customers){

    const name=normalize(customer);

    const words=name.split(" ");

    if(words.some(word=>word.length>=3 && normalized_message.includes(word))){

      return{
        intent,
        customer,
      };

    }

  }

//fallback for fuse
  const indexed=customers.map(customer=>({
    original:customer,
    normalized:normalize(customer),
  }));

  const fuse=new Fuse(indexed,{
    keys:["normalized"],
    threshold:0.5,
    ignoreLocation:true,
  });

  const result=fuse.search(normalized_message);

  if(result.length){

    return{
      intent,
      customer:result[0].item.original,
    };

  }

  throw new Error("Customer not found.");

};

export default parse_message;