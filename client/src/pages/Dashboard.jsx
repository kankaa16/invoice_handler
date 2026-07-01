import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import SearchBar from "../components/SearchBar";
import BucketTabs from "../components/BucketTabs";
import StatCards from "../components/StatCards";
import InvoiceTable from "../components/InvoiceTable";

function Dashboard() {
  const [search, setSearch] = useState("");
  const [bucket, setBucket] = useState("All");
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const res = await fetch("http://localhost:5010/api/invoices");

    const data = await res.json();

    setInvoices(data.invoices);

  };
//for filtring as per due days
  const filteredInvoices=invoices.filter((invoice) => {
    const matchesBucket= bucket === "All" || invoice.bucket === bucket;

    const matchesSearch=
      invoice.customer.toLowerCase().includes(search.toLowerCase()) ||
      invoice.invoiceNo.toLowerCase().includes(search.toLowerCase());

    return matchesBucket && matchesSearch;
  });

  const bucketStats={
  All: {
    count: invoices.length,
    outstanding: invoices.reduce(
      (sum, i) => sum + Number(i.outstanding),
      0
    ),
  },
};

[
  "Not Due",
  "0-15",
  "16-30",
  "31-60",
  "61-90",
  "90+",
  "No-Due-Date-Given",
].forEach((bucketName) => {
  const bucketInvoices = invoices.filter(
    (i) => i.bucket === bucketName
  );

  bucketStats[bucketName] = {
    count: bucketInvoices.length,
    outstanding: bucketInvoices.reduce(
      (sum, i) => sum + Number(i.outstanding),
      0
    ),
  };
});

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <UploadBox />

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <BucketTabs
          active={bucket}
          setActive={setBucket}
          bucketStats={bucketStats}
        />

        <StatCards invoices={filteredInvoices} />

        <InvoiceTable invoices={filteredInvoices} />
      </div>
    </div>
  );
}

export default Dashboard;