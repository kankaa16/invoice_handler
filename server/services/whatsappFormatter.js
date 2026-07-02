import {format} from "date-fns";

const format_currency=(amount)=>{
  return Number(amount).toLocaleString("en-IN",{
    minimumFractionDigits:2,
    maximumFractionDigits:2,
  });
};

const format_weekly_payment_summary=(report)=>{

  return `*WEEKLY PAYMENT SCHEDULE*

Customer : ${report.customer}
SPOC     : ${report.spoc}

----------------------------------------

Overdue Amount      : ₹${format_currency(report.overdue_amount)}
Due This Week       : ₹${format_currency(report.due_this_week)}
Total Outstanding   : ₹${format_currency(report.total_outstanding)}

----------------------------------------

AGEING

90+ Days            ₹${format_currency(report.ageing["90+"])}
61-90 Days          : ₹${format_currency(report.ageing["61-90"])}
31-60 Days          : ₹${format_currency(report.ageing["31-60"])}
16-30 Days          : ₹${format_currency(report.ageing["16-30"])}
0-15 Days           : ₹${format_currency(report.ageing["0-15"])}
Not Due             : ₹${format_currency(report.ageing["Not Due"])}
`;

};

const format_weekly_payment_invoices=(report)=>{

  let message=`*INVOICE DETAILS*\n\n`;

  report.invoices.forEach((invoice)=>{

    message+=`${invoice.invoice_no}
Due Date    : ${format(new Date(invoice.due_date),"dd MMM yyyy")}
Outstanding : ₹${format_currency(invoice.outstanding)}

`;

  });

  return message;

};

const format_weekly_collection_summary=(report)=>{

  return `*WEEKLY COLLECTION FOLLOW-UP*

Customer : ${report.customer}
SPOC     : ${report.spoc}

Week : ${format(report.week_start,"dd MMM yyyy")} - ${format(report.week_end,"dd MMM yyyy")}

----------------------------------------

Overdue Amount      : ₹${format_currency(report.overdue_amount)}
Due This Week       : ₹${format_currency(report.due_this_week)}
Collection Target   : ₹${format_currency(report.total_collection_target)}

----------------------------------------

DAY WISE COLLECTION

Overdue (Mon) : ₹${format_currency(report.day_wise.Overdue_As_Of_Monday)}

Monday         : ₹${format_currency(report.day_wise.Monday)}

Tuesday        : ₹${format_currency(report.day_wise.Tuesday)}

Wednesday      : ₹${format_currency(report.day_wise.Wednesday)}

Thursday       : ₹${format_currency(report.day_wise.Thursday)}

Friday         : ₹${format_currency(report.day_wise.Friday)}
`;

};

const format_weekly_collection_invoices=(report)=>{

  let message=`*INVOICE DETAILS*\n\n`;

  report.invoices.forEach((invoice)=>{

    message+=`${invoice.invoice_no}
Due Date    : ${format(new Date(invoice.due_date),"dd MMM yyyy")}
Outstanding : ₹${format_currency(invoice.outstanding)}

`;

  });

  return message;

};

export{
  format_weekly_payment_summary,
  format_weekly_payment_invoices,
  format_weekly_collection_summary,
  format_weekly_collection_invoices,
};