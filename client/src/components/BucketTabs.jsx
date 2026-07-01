const buckets = [
  "All",
  "Not Due",
  "0-15",
  "16-30",
  "31-60",
  "61-90",
  "90+",
];

function BucketTabs({ active, setActive }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {buckets.map((bucket) => (
        <button
          key={bucket}
          onClick={() => setActive(bucket)}
          className={`px-4 py-2 rounded-lg border transition
            ${
              active === bucket
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
        >
          {bucket}
        </button>
      ))}
    </div>
  );
}

export default BucketTabs;