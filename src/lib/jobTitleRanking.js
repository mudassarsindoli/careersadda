export const CATEGORY_KEYWORDS = {
  technology: [
    "software",
    "developer",
    "engineer",
    "engineering",
    "programmer",
    "frontend",
    "front end",
    "backend",
    "back end",
    "full stack",
    "fullstack",
    "devops",
    "qa",
    "quality assurance",
    "tester",
    "testing",
    "cloud",
    "cybersecurity",
    "cyber security",
    "security",
    "web",
    "mobile",
    "android",
    "ios",
    "site reliability",
    "sre",
    "data engineer",
    "data analyst",
    "it support",
    "helpdesk",
  ],
  finance: [
    "finance",
    "financial",
    "accounting",
    "accountant",
    "accounts payable",
    "accounts receivable",
    "audit",
    "bank",
    "invest",
    "trading",
    "trader",
    "trade",
    "portfolio",
    "wealth",
    "asset",
    "risk",
    "credit",
    "loan",
    "mortgage",
    "private equity",
    "hedge fund",
    "fintech",
    "actuary",
    "actuarial",
    "insurance",
  ],
  retail: [
    "retail",
    "store",
    "cashier",
    "merchandising",
    "merchandiser",
    "sales associate",
    "shop",
    "fashion",
    "apparel",
    "luxury",
  ],
  healthcare: [
    "health",
    "healthcare",
    "medical",
    "medicine",
    "nurse",
    "doctor",
    "physician",
    "clinical",
    "pharma",
    "biotech",
    "patient",
    "hospital",
    "surgery",
    "surgeon",
    "therapy",
    "therapist",
    "pharmacist",
    "pharmacy",
    "lab",
    "laboratory",
    "dental",
    "dentist",
    "life sciences",
  ],
  "ai-orchestration": [
    "ai",
    "artificial intelligence",
    "machine learning",
    "ml",
    "deep learning",
    "neural",
    "llm",
    "large language model",
    "generative ai",
    "gen ai",
    "genai",
    "nlp",
    "natural language processing",
    "computer vision",
    "data scientist",
    "prompt engineer",
    "prompt engineering",
    "ai agent",
    "ai agents",
    "rag",
    "mlops",
    "model training",
  ],
  "e-commerce": [
    "ecommerce",
    "e commerce",
    "marketplace",
    "online store",
    "checkout",
    "cart",
    "fulfillment",
    "fulfilment",
    "catalog",
    "catalogue",
    "d2c",
    "dropshipping",
    "digital commerce",
    "commerce",
  ],
  saas: [
    "saas",
    "subscription",
    "customer success",
    "product manager",
    "product owner",
    "product design",
    "marketing",
    "growth",
    "sales",
    "account executive",
    "crm",
    "b2b software",
  ],
  "enterprise-b2b-infrastructure": [
    "enterprise",
    "b2b",
    "business to business",
    "infrastructure",
    "platform engineer",
    "platform engineering",
    "solution architect",
    "solutions architect",
    "systems",
    "network",
    "database",
    "kubernetes",
    "storage",
    "data center",
    "datacenter",
    "sysadmin",
  ],
};

const CATEGORY_ORDER = Object.keys(CATEGORY_KEYWORDS);

function tokenize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function tokenMatches(token, keyword) {
  return token === keyword || (keyword.length >= 4 && token.startsWith(keyword));
}

function phraseMatches(tokens, start, keywordTokens) {
  return keywordTokens.every((keyword, offset) => {
    const token = tokens[start + offset];
    return token ? tokenMatches(token, keyword) : false;
  });
}

function earliestMatch(tokens, keywords) {
  let earliest = Infinity;

  for (const keyword of keywords) {
    const keywordTokens = tokenize(keyword);
    if (keywordTokens.length === 0) continue;

    const lastStart = tokens.length - keywordTokens.length;
    for (let start = 0; start <= lastStart; start += 1) {
      if (phraseMatches(tokens, start, keywordTokens)) {
        earliest = Math.min(earliest, start);
        break;
      }
    }
  }

  return earliest;
}

export function matchedCategoryIds(term) {
  const tokens = tokenize(term);
  if (tokens.length === 0) return [];

  return CATEGORY_ORDER.map((categoryId, order) => ({
    categoryId,
    order,
    position: earliestMatch(tokens, CATEGORY_KEYWORDS[categoryId]),
  }))
    .filter((match) => Number.isFinite(match.position))
    .sort((a, b) => a.position - b.position || a.order - b.order)
    .map((match) => match.categoryId);
}

export function rankCompaniesByJobTitle(companies, term) {
  const rankedCategories = matchedCategoryIds(term);
  if (rankedCategories.length === 0) return companies;

  const categoryRank = new Map(
    rankedCategories.map((categoryId, index) => [categoryId, index]),
  );
  const fallbackRank = rankedCategories.length;

  return companies
    .map((company, index) => ({
      company,
      index,
      rank: categoryRank.get(company.categoryId) ?? fallbackRank,
    }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.company);
}
