const SearchBar = ({ globalFilter, setGlobalFilter }) => {
  return (
    <input
      className="border p-2 rounded"
      placeholder="Search..."
      value={globalFilter ?? ""}
      onChange={(e) => setGlobalFilter(e.target.value)}
    />
  );
};

export default SearchBar;