import React, { useState } from "react";
import { Circles } from "react-loader-spinner";

const SearchBar = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="flex justify-center gap-2 mb-6"
        >
            <input className="p-2 rounded font-normal text-black focus:outline-none focus:ring-blue-500 transition-all"
              type="text"
              placeholder="Search for music..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}  
            />
            <button 
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Circles color="#FFFFFF" height={20} width={20} />
                ) : (
                    "Search"
                )}
            </button>
        </form>
    );
};

export default SearchBar;