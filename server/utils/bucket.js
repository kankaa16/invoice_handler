import {differenceInCalendarDays} from "date-fns";

//bucket age calc

export const getBucket=(dueDate) => {
  if (!dueDate) return "No-Due-Date-Given";

  const today=new Date();

  const due=new Date(dueDate);

  const days=differenceInCalendarDays(today, due);

  if (days<0) return "Not Due";

  if (days<=15) return "0-15";

  if (days<=30) return "16-30";

  if (days<=60) return "31-60";

  if (days<=90) return "61-90";

  return "90+";
};