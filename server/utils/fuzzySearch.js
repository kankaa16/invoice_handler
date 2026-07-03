import Fuse from "fuse.js";
import Invoice from "../models/Invoice.js";

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/private limited|pvt\.?\s*ltd|pvt|limited|ltd|customer/gi, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const get_matching_customer = async (customer_name) => {

  const customers = await Invoice.distinct("customer");

  const query = normalize(customer_name);

  // 1. Exact word match
  for (const customer of customers) {

    const words = normalize(customer).split(" ");

    if (words.includes(query)) {
      return customer;
    }
  }

  // 2. Substring match
  const direct = customers.find(c =>
    normalize(c).includes(query)
  );

  if (direct) {
    return direct;
  }

  // 3. Fuse fallback
  const fuse = new Fuse(customers, {
    includeScore: true,
    threshold: 0.2,
    ignoreLocation: true,
    getFn: c => normalize(c),
  });

  const result = fuse.search(query);

  if (!result.length) {
    return null;
  }

  return result[0].item;
};

export { get_matching_customer };