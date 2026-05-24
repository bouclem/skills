import * as path from "path";
import * as vscode from "vscode";
import { SkillRecord } from "./types";

type Node =
  | { kind: "category"; name: string; children: Node[] }
  | { kind: "skill"; skill: SkillRecord; active: boolean }
  | { kind: "companion"; label: string; absPath: string }
  | { kind: "section"; label: string; children: Node[] };

export class SkillsTreeProvider implements vscode.TreeDataProvider<Node> {
  private _onDidChange = new vscode.EventEmitter<Node | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChange.event;

  private root: Node = { kind: "category", name: "SKILLS", children: [] };
  private active = new Set<string>();

  setSkills(skills: SkillRecord[]) {
    this.root = buildTree(skills);
    this._onDidChange.fire();
  }

  setActive(activeIds: Set<string>) {
    this.active = activeIds;
    this._onDidChange.fire();
  }

  refresh() {
    this._onDidChange.fire();
  }

  getTreeItem(node: Node): vscode.TreeItem {
    if (node.kind === "category") {
      const item = new vscode.TreeItem(node.name, vscode.TreeItemCollapsibleState.Collapsed);
      item.iconPath = new vscode.ThemeIcon("folder");
      item.contextValue = "category";
      const total = countSkills(node);
      item.description = `${total}`;
      return item;
    }
    if (node.kind === "section") {
      const item = new vscode.TreeItem(node.label, vscode.TreeItemCollapsibleState.Collapsed);
      item.iconPath = new vscode.ThemeIcon("symbol-folder");
      return item;
    }
    if (node.kind === "skill") {
      const fm = node.skill.frontmatter;
      const label = (typeof fm.name === "string" && fm.name) ? fm.name : node.skill.id;
      const item = new vscode.TreeItem(
        label,
        node.skill.companions.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
      );
      const isActive = this.active.has(node.skill.id);
      item.iconPath = new vscode.ThemeIcon(isActive ? "star-full" : "book");
      item.description = node.skill.id;
      item.tooltip = (typeof fm.description === "string" ? fm.description : node.skill.body.slice(0, 200));
      item.contextValue = isActive ? "skill-active" : "skill";
      item.command = {
        command: "kiroSkills.openSkill",
        title: "Open SKILL.md",
        arguments: [node.skill]
      };
      return item;
    }
    // companion
    const item = new vscode.TreeItem(node.label, vscode.TreeItemCollapsibleState.None);
    item.iconPath = new vscode.ThemeIcon("file");
    item.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [vscode.Uri.file(node.absPath)]
    };
    item.resourceUri = vscode.Uri.file(node.absPath);
    return item;
  }

  getChildren(node?: Node): Node[] {
    if (!node) {
      return (this.root as Extract<Node, { kind: "category" }>).children;
    }
    if (node.kind === "category" || node.kind === "section") {
      return node.children;
    }
    if (node.kind === "skill") {
      return buildCompanionNodes(node.skill);
    }
    return [];
  }
}

function buildTree(skills: SkillRecord[]): Node {
  const root: Extract<Node, { kind: "category" }> = { kind: "category", name: "SKILLS", children: [] };
  // Sort skills for stable display
  const sorted = [...skills].sort((a, b) => {
    const ca = a.category.join("/");
    const cb = b.category.join("/");
    if (ca !== cb) return ca.localeCompare(cb);
    return a.id.localeCompare(b.id);
  });
  for (const s of sorted) {
    let cursor: Extract<Node, { kind: "category" }> = root;
    for (const segment of s.category) {
      let child = cursor.children.find(
        (c): c is Extract<Node, { kind: "category" }> => c.kind === "category" && c.name === segment
      );
      if (!child) {
        child = { kind: "category", name: segment, children: [] };
        cursor.children.push(child);
      }
      cursor = child;
    }
    cursor.children.push({ kind: "skill", skill: s, active: false });
  }
  return root;
}

function buildCompanionNodes(skill: SkillRecord): Node[] {
  if (skill.companions.length === 0) return [];
  const grouped = new Map<string, Node[]>();
  for (const c of skill.companions) {
    const key = c.category || "(loose)";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push({
      kind: "companion",
      label: path.basename(c.relPath),
      absPath: c.absPath
    });
  }
  const sections: Node[] = [];
  for (const [cat, children] of grouped) {
    sections.push({ kind: "section", label: cat, children });
  }
  return sections;
}

function countSkills(node: Node): number {
  if (node.kind === "skill") return 1;
  if (node.kind === "category" || node.kind === "section") {
    return node.children.reduce((acc, c) => acc + countSkills(c), 0);
  }
  return 0;
}
