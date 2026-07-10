import fs from "node:fs";
import path from "node:path";

export type E2EState = {
  runId: string;
  adminEmail: string;
  adminPassword: string;
  catalogVersionKey: string;
  ruleVersionKey: string;
};

const STATE_PATH = path.join(__dirname, "..", ".e2e-state.json");

export function writeE2EState(state: E2EState) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

export function readE2EState(): E2EState {
  return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
}

export function clearE2EState() {
  if (fs.existsSync(STATE_PATH)) {
    fs.unlinkSync(STATE_PATH);
  }
}
