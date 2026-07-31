import fs from "fs";
import path from "path";

/**
 * Read-only fallback served when the database is unreachable.
 *
 * The hosted Postgres instance this project was built against is not
 * guaranteed to be running, and a portfolio demo that returns 500s is worse
 * than one serving the same fixtures the database was seeded from. Responses
 * built here are flagged with `seeded: true` so callers can tell the
 * difference, and every write path still fails loudly rather than pretending
 * to have saved anything.
 */

// Resolved at runtime rather than hardcoded: this file runs from source under
// ts-node, from dist/ after tsc, and from a bundled function on Vercel, and the
// relative depth to prisma/seedData differs in each.
const SEED_DIR_CANDIDATES = [
  path.join(__dirname, "..", "prisma", "seedData"),
  path.join(__dirname, "..", "..", "prisma", "seedData"),
  path.join(process.cwd(), "prisma", "seedData"),
  path.join(process.cwd(), "server", "prisma", "seedData")
];

const resolveSeedDir = (): string | null =>
  SEED_DIR_CANDIDATES.find(dir => fs.existsSync(dir)) ?? null;

const read = <T>(file: string): T[] => {
  const dir = resolveSeedDir();
  if (!dir) {
    console.warn("Seed fallback: could not locate prisma/seedData");
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
  } catch (error) {
    console.warn(`Seed fallback: could not read ${file}`, error);
    return [];
  }
};

// seed.ts inserts each file in order into an empty table, so a record's id is
// its 1-based position. The fixtures themselves carry no ids.
const withIds = <T>(rows: T[], key: string): (T & Record<string, number>)[] =>
  rows.map((row, i) => ({ ...row, [key]: i + 1 } as T & Record<string, number>));

let cache: {
  projects: any[];
  tasks: any[];
  users: any[];
  teams: any[];
} | null = null;

const load = () => {
  if (!cache) {
    cache = {
      projects: withIds(read<any>("project.json"), "project_ID"),
      tasks: withIds(read<any>("task.json"), "task_ID"),
      users: withIds(read<any>("user.json"), "user_ID"),
      teams: withIds(read<any>("team.json"), "team_ID")
    };
  }
  return cache;
};

/**
 * True when an error means "the database is not reachable" rather than a
 * genuine application fault. Prisma reports connectivity through P1001, P1002
 * and P1017, and Accelerate wraps the same condition as P6008.
 */
export const isDatabaseUnreachable = (error: unknown): boolean => {
  const code = (error as { code?: string })?.code;
  if (code && ["P1001", "P1002", "P1017", "P6008"].includes(code)) return true;

  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("P6008") ||
    message.includes("Can't reach database server") ||
    message.includes("was not able to connect")
  );
};

const paginate = <T>(rows: T[], limit: number, offset: number) => ({
  data: rows.slice(offset, offset + limit),
  meta: { total: rows.length, limit, offset, seeded: true }
});

export const seededProjects = (limit: number, offset: number) =>
  paginate(load().projects, limit, offset);

export const seededTasks = (projectId: number, limit: number, offset: number) =>
  paginate(
    load().tasks.filter(task => task.project_ID === projectId),
    limit,
    offset
  );

export const seededTasksByUser = (userId: number) =>
  load().tasks.filter(
    task => task.author_user_ID === userId || task.assigned_user_ID === userId
  );

export const seededUsers = () => load().users;

export const seededTeams = () => load().teams;

export const seededSearch = (query: string) => {
  const q = query.toLowerCase();
  const matches = (value: unknown) =>
    typeof value === "string" && value.toLowerCase().includes(q);

  return {
    tasks: load().tasks.filter(t => matches(t.title) || matches(t.description)),
    projects: load().projects.filter(p => matches(p.name) || matches(p.description)),
    users: load().users.filter(u => matches(u.username)),
    seeded: true
  };
};
