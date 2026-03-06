import { loadMembers } from "./members";
import { loadAssignments } from "./assignments";

async function init() {
  await loadMembers();
  await loadAssignments();
}

init();

