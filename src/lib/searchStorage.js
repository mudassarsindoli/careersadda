const STORAGE_KEY = "careersadda.search";

export function loadSearch() {
  if (typeof window === "undefined") return "";

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return "";

    const stored = JSON.parse(raw);
    if (typeof stored === "string") return stored;
    return typeof stored?.jobTitle === "string" ? stored.jobTitle : "";
  } catch {
    return "";
  }
}

export function saveSearch(jobTitle) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(typeof jobTitle === "string" ? jobTitle : ""),
    );
  } catch {
    /* ignore unavailable storage */
  }
}
