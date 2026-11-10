import { useState } from "react";

export default function Logo({ company, className = "h-6 w-6" }) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={`flex ${className} shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-50`}
    >
      {failed || !company.logo ? (
        <span
          className="text-[10px] font-semibold text-zinc-400 select-none"
          aria-hidden="true"
        >
          {company.initials}
        </span>
      ) : (
        <img
          src={company.logo}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      )}
    </span>
  );
}
