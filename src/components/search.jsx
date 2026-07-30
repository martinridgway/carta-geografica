import React, { useState } from "react";

function SearchBox({ onSearch, disabled }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async event => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    setError(null);

    try {
      await onSearch(query.trim());
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form id="search-box" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder="Search for a place"
        disabled={disabled}
        aria-label="Search for a place"
      />
      <button type="submit" disabled={disabled}>
        Go
      </button>
      {error && <p className="search-box__error">{error}</p>}
    </form>
  );
}

export default SearchBox;
