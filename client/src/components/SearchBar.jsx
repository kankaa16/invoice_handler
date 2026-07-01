function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search Customer / Invoice..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-black"
    />
  );
}

export default SearchBar;