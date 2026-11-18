// Zapíše počty klonů (a zobrazení) všech repozitářů daného ownera za posledních
// 14 dní do .github/clone-stats/badge.json ve formátu shields.io endpoint badge.
// GitHub traffic API drží data jen 14 dní, proto se musí sbírat pravidelně.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const TOKEN = process.env.GH_TOKEN;
const OWNER = process.env.GH_OWNER || "makrelsonvasek13-tech";
const OUT = process.argv[2] || ".github/clone-stats/badge.json";
const API = "https://api.github.com";

async function gh(path) {
  const r = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "clone-stats-badge",
    },
  });
  if (!r.ok) throw new Error(`${path} -> ${r.status} ${r.statusText}`);
  return r.json();
}

const repos = await gh(`/users/${OWNER}/repos?per_page=100&type=owner`);
const perRepo = [];
let clones = 0, uniqueCloners = 0, views = 0, uniqueVisitors = 0;

for (const repo of repos) {
  const row = { repo: repo.name };
  try {
    const c = await gh(`/repos/${OWNER}/${repo.name}/traffic/clones`);
    clones += c.count;
    uniqueCloners += c.uniques;
    Object.assign(row, { clones: c.count, uniqueCloners: c.uniques });
  } catch (e) {
    row.clonesError = String(e.message);
  }
  try {
    const v = await gh(`/repos/${OWNER}/${repo.name}/traffic/views`);
    views += v.count;
    uniqueVisitors += v.uniques;
    Object.assign(row, { views: v.count, uniqueVisitors: v.uniques });
  } catch (e) {
    row.viewsError = String(e.message);
  }
  perRepo.push(row);
}

const badge = {
  schemaVersion: 1,
  label: "clones",
  message: String(clones),
  color: clones > 0 ? "blue" : "lightgrey",
  window: "14 days",
  uniqueCloners,
  views,
  uniqueVisitors,
  updatedAt: new Date().toISOString(),
  repos: perRepo,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(badge, null, 2) + "\n");
console.log(`clones=${clones} unique=${uniqueCloners} views=${views} -> ${OUT}`);
