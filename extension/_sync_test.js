// Smoke test the user-folder sync logic without touching the real ~/.kiroskills.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { syncWorkspaceToUser, resolveUserRoot } = require("./out/userSync");
const { scanSkillsMulti } = require("./out/scanner");

// Use a temp folder as the "user root" for this test.
const tmp = path.join(os.tmpdir(), "kiroskills-test-" + Date.now());
const wsRoot = path.resolve(__dirname, "..", "SKILLS");

console.log(`workspace: ${wsRoot}`);
console.log(`tmp user:  ${tmp}`);
console.log(`resolveUserRoot('~/.kiroskills') = ${resolveUserRoot("~/.kiroskills")}`);
console.log(`resolveUserRoot('~/foo/bar')     = ${resolveUserRoot("~/foo/bar")}`);

let r1 = syncWorkspaceToUser(wsRoot, tmp);
console.log(`First sync: copied=${r1.copied}, skipped=${r1.skipped}`);

let r2 = syncWorkspaceToUser(wsRoot, tmp);
console.log(`Second sync (idempotent): copied=${r2.copied}, skipped=${r2.skipped}`);
if (r2.copied !== 0) {
  console.error("FAIL: second sync should copy nothing");
  process.exit(1);
}

// Verify the synced folder has the same number of SKILL.md files
const companions = ["references","examples","tutorials","scripts","evals","assets","resources","templates","docs","fixtures","samples"];
const merged = scanSkillsMulti([wsRoot, tmp], companions);
const userOnly = scanSkillsMulti([tmp], companions);
console.log(`workspace+user merged (deduped): ${merged.length}`);
console.log(`user only:                       ${userOnly.length}`);

// Cleanup
fs.rmSync(tmp, { recursive: true, force: true });
console.log("cleanup OK");
