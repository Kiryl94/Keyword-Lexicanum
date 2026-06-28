// SQLite schema placeholder — wired in Week 1 milestone per tech-stack.md
export const DB_SCHEMA = `
CREATE TABLE IF NOT EXISTS rules_corpus_chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_system TEXT NOT NULL,
  keyword TEXT NOT NULL,
  phase TEXT,
  content TEXT NOT NULL,
  source_ref TEXT NOT NULL
);

CREATE VIRTUAL TABLE IF NOT EXISTS rules_fts USING fts5(
  keyword,
  content,
  phase,
  game_system,
  content='rules_corpus_chunks',
  content_rowid='id'
);
`;
