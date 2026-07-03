import {format} from "date-fns";

const format_currency=(amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const line="────────────────────────────────";

const format_due_date=(date) => {
  if (!date) return "Not Available";
  return format(new Date(date), "dd MMM yyyy");
};

// for spacing n all
const sanitize_whatsapp_text=(value) => {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[*_~`]/g, "");
};

const pad_row=(label, value) => {
  return `${label.padEnd(28, " ")}${value}`;
};

// payment summary
const format_weekly_payment_summary=(report) => {

  const customer=sanitize_whatsapp_text(report.customer);
  const spoc=sanitize_whatsapp_text(report.spoc);

  const summary=
`\`\`\`
${pad_row("Overdue Amount", `₹${format_currency(report.overdue_amount)}`)}
${pad_row("Due This Week", `₹${format_currency(report.due_this_week)}`)}
${pad_row("Total Outstanding", `₹${format_currency(report.total_outstanding)}`)}
\`\`\``;

  const ageing=
`\`\`\`
${pad_row("90+ Days", `₹${format_currency(report.ageing["90+"])}`)}
${pad_row("61-90 Days", `₹${format_currency(report.ageing["61-90"])}`)}
${pad_row("31-60 Days", `₹${format_currency(report.ageing["31-60"])}`)}
${pad_row("16-30 Days", `₹${format_currency(report.ageing["16-30"])}`)}
${pad_row("0-15 Days", `₹${format_currency(report.ageing["0-15"])}`)}
${pad_row("Not Due", `₹${format_currency(report.ageing["Not Due"])}`)}
\`\`\``;

  return `*WEEKLY PAYMENT REMINDER — ${customer}*

Dear Sir/Madam,

Greetings from ProcWing Collections.

As per our records, the following amounts are outstanding in your account.

Customer  : ${customer}
SPOC      : ${spoc}

${line}

*OUTSTANDING SUMMARY*

${summary}

${line}

*AGEING BREAKDOWN*

${ageing}

${line}

This is a gentle reminder to arrange payment of the overdue invoices and invoices falling due during the current week.

Kindly share the expected payment date(s) and transaction details for our records.

Invoice details are shared in the next message.

Regards,

*ProcWing Collections Team*`;

};

// payment msgs
const format_weekly_payment_invoices=(report) => {

  let message=`*INVOICE DETAILS*\n\n`;

  report.invoices.slice(0,5).forEach((invoice,index)=>{

    message+=`${index+1}. ${sanitize_whatsapp_text(invoice.invoice_no)}

Due Date
${format_due_date(invoice.due_date)}

Outstanding
₹${format_currency(invoice.outstanding)}

${line}

`;

  });

  if(report.invoices.length>5){
    message+=`Showing first 5 of ${report.invoices.length} invoices.`;
  }

  return message;

};

//collection summary

const format_weekly_collection_summary=(report) => {

  const customer= sanitize_whatsapp_text(report.customer);
  const spoc= sanitize_whatsapp_text(report.spoc);

  const week=
`${format(report.week_start,"dd MMM yyyy")} - ${format(report.week_end,"dd MMM yyyy")}`;

  const summary=
`\`\`\`
${pad_row("Overdue Amount", `₹${format_currency(report.overdue_amount)}`)}
${pad_row("Due This Week", `₹${format_currency(report.due_this_week)}`)}
${pad_row("Collection Target", `₹${format_currency(report.total_collection_target)}`)}
\`\`\``;

  let dayWise=
`\`\`\`
${pad_row("Overdue as of Monday", `₹${format_currency(report.day_wise.Overdue_As_Of_Monday)}`)}
${pad_row("Monday", `₹${format_currency(report.day_wise.Monday)}`)}
${pad_row("Tuesday", `₹${format_currency(report.day_wise.Tuesday)}`)}
${pad_row("Wednesday", `₹${format_currency(report.day_wise.Wednesday)}`)}
${pad_row("Thursday", `₹${format_currency(report.day_wise.Thursday)}`)}
${pad_row("Friday", `₹${format_currency(report.day_wise.Friday)}`)}`;

  if(report.day_wise.Total_By_Friday!==undefined){
    dayWise+=`\n${pad_row("Total Dues By Friday",`₹${format_currency(report.day_wise.Total_By_Friday)}`)}`;
  }

  dayWise+=`\n\`\`\``;

  return `*WEEKLY COLLECTION FOLLOW-UP — ${customer}*

Dear Team,

Please find below the customer account status for the current week.

Customer  : ${customer}
SPOC      : ${spoc}
Week      : ${week}

${line}

*COLLECTION SUMMARY*

${summary}

${line}

*DAY-WISE COLLECTION PLAN*

${dayWise}

${line}

Please prioritize closure of overdue invoices and ensure timely collection of invoices falling due during the week.

Kindly share the expected realization dates against pending invoices and highlight any concerns, disputes, approvals or operational issues that may impact collections.

Invoice details are shared in the next message.

Regards,

*ProcWing Collections Team*`;

};
 
// followup msg
const format_weekly_collection_invoices = (report) => {

  let message=`*INVOICE DETAILS*\n\n`;

  report.invoices.slice(0,5).forEach((invoice,index)=>{

    message+= `${index+1}. ${sanitize_whatsapp_text(invoice.invoice_no)}

Due Date
${format_due_date(invoice.due_date)}

Outstanding
₹${format_currency(invoice.outstanding)}

${line}

`;

  });

  if(report.invoices.length>5){
    message += `Showing first 5 of ${report.invoices.length} invoices.`;
  }

  return message;

};

export {
  format_weekly_payment_summary,
  format_weekly_payment_invoices,
  format_weekly_collection_summary,
  format_weekly_collection_invoices,
};