import { useState } from "react";

function UploadBox() {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    if (!file) return alert("Choose a file first.");

    const formData = new FormData();

    formData.append("sheet", file);

    const res = await fetch("http://localhost:5010/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    alert(`${data.imported} invoices imported.`);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h2 className="text-xl font-semibold mb-5">
        Upload AR Sheet
      </h2>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={uploadFile}
        className="ml-4 bg-black text-white px-5 py-2 rounded-lg"
      >
        Upload
      </button>

    </div>
  );
}

export default UploadBox;