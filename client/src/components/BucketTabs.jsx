const buckets=["All","Not Due","0-15","16-30","31-60","61-90","90+","No-Due-Date-Given"];

export default function BucketTabs({
  active,
  setActive,
  bucketStats,
}) {
  return (
    <div className="grid grid-cols-5 gap-4">

  <button
    onClick={() => setActive("All")}
    className={`row-span-2 rounded-xl border p-6 text-left transition
      ${
        active === "All"
          ? "border-black bg-stone-200"
          : "bg-white hover:border-stone-400"
      }`}
  >
    <p className="text-sm text-stone-500">All</p>

    <h2 className="text-5xl font-bold mt-4">
      {bucketStats.All.count}
    </h2>

    <p className="mt-4 text-lg text-stone-500">
      ₹ {bucketStats.All.outstanding.toLocaleString("en-IN")}
    </p>
  </button>

  {buckets
    .filter((b) => b !== "All")
    .map((bucket) => {
      const stats = bucketStats[bucket];

      return (
        <button
          key={bucket}
          onClick={() => setActive(bucket)}
          className={`rounded-xl border p-4 text-left transition
            ${
              active === bucket
                ? "border-black bg-stone-200"
                : "bg-white hover:border-stone-400"
            }`}
        >
          <p className="text-xs text-stone-500">
            {bucket}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats?.count || 0}
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            ₹ {(stats?.outstanding || 0).toLocaleString("en-IN")}
          </p>
        </button>
      );
    })}
</div>
  );
}