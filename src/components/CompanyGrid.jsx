import { buildPortalUrl } from "../lib/buildPortalUrl.js";
import Logo from "./Logo.jsx";

export default function CompanyGrid({ companies, query }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
      {companies.map((company) => {
        const hasQuerySlot = company.careersUrl.includes("{query}");

        return (
          <li key={company.id}>
            <a
              href={buildPortalUrl(company.careersUrl, query)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${company.name} careers in a new tab`}
              title={
                hasQuerySlot
                  ? undefined
                  : "This link does not forward your job title search"
              }
              className={`flex h-full items-center gap-2.5 rounded-lg border p-3 text-sm transition hover:shadow-sm ${
                hasQuerySlot
                  ? "border-zinc-200 text-zinc-900 hover:border-zinc-300"
                  : "border-red-200 text-red-600 hover:border-red-300"
              }`}
            >
              <Logo company={company} className="h-7 w-7" />
              <span className="min-w-0 truncate font-medium">
                {company.name}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
