function InvoiceTable({ invoices }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-auto">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="text-left p-4">Customer</th>

            <th className="text-left p-4">Invoice</th>

            <th className="text-left p-4">Due Date</th>

            <th className="text-right p-4">Outstanding</th>

          </tr>

        </thead>

        <tbody>

          {invoices.map((invoice) => (
            <tr
              key={invoice._id}
              className="border-t"
            >
              <td className="p-4">
                {invoice.customer}
              </td>

              <td className="p-4">
                {invoice.invoiceNo}
              </td>

              <td className="p-4">
                {invoice.dueDate
                  ? new Date(invoice.dueDate).toLocaleDateString()
                  : "-"}
              </td>

              <td className="p-4 text-right">
                ₹ {invoice.outstanding}
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default InvoiceTable;