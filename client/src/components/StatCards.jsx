function StatCards({ invoices }) {
  const totalOutstanding = invoices.reduce(
    (sum, item) => sum + Number(item.outstanding || 0),
    0
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

      <div className="bg-white rounded-lg p-5 shadow">
        <p className="text-gray-500">Invoices</p>

        <h2 className="text-3xl font-bold">
          {invoices.length}
        </h2>
      </div>

      <div className="bg-white rounded-lg p-5 shadow">
        <p className="text-gray-500">
          Outstanding
        </p>

        <h2 className="text-3xl font-bold">
          ₹ {totalOutstanding.toLocaleString()}
        </h2>
      </div>

    </div>
  );
}

export default StatCards;