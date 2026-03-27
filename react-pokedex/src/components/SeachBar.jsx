import { useState, useRef } from "react";
import { resolvePokemon } from "../hooks/usePokemon.js";

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");
  const [cooldown, setCooldown] = useState(false);

  const handleSearch = () => {
    if (input.trim()) onSearch(input.trim());
  };

  const handleRandom = async () => {
    if (cooldown) return;
    setCooldown(true);
    setTimeout(() => setCooldown(false), 2000);

    const randomId = Math.floor(Math.random() * 1025) + 1;
    setInput(String(randomId));
    try {
      const data = await resolvePokemon(String(randomId));
      setInput(data.name);
    } catch (_) {}
    onSearch(String(randomId));
  };

  return (
    <div className="search-box">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Enter Pokémon name"
      />
      <button onClick={handleSearch}>Search</button>
      <button
        id="random-button"
        onClick={handleRandom}
        disabled={cooldown}
      >
        {cooldown ? "WAIT..." : "? Random"}
      </button>
    </div>
  );
};

export default SearchBar;
