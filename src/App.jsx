import { useEffect, useMemo, useState } from "react";
import CompanyGrid from "./components/CompanyGrid.jsx";
import { companies } from "./lib/derive.js";
import { rankCompaniesByJobTitle } from "./lib/jobTitleRanking.js";
import { loadSearch, saveSearch } from "./lib/searchStorage.js";

export default function App() {
  const [query, setQuery] = useState(loadSearch);
  const term = query.trim();

  const visibleCompanies = useMemo(
    () => rankCompaniesByJobTitle(companies, term),
    [term],
  );

  useEffect(() => {
    saveSearch(query);
  }, [query]);

  return (
    <div className="min-h-svh bg-white text-zinc-900 antialiased">
      <div className="w-full px-4 py-6 sm:px-6">
        <label htmlFor="job-search" className="sr-only">
          Job title
        </label>
        <input
          id="job-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Enter a job title…"
          autoComplete="off"
          spellCheck="false"
          enterKeyHint="search"
          className="w-full max-w-md rounded-lg border border-zinc-300 px-4 py-2.5 text-base text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500"
        />

        <CompanyGrid companies={visibleCompanies} query={term} />
      </div>
    </div>
  );
}
