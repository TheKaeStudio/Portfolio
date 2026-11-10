import { skillTree, type SkillBranch } from './skills';

export const world = { width: 2600, height: 1700 };

const center = { x: world.width / 2, y: world.height / 2 };
const scale = { x: 1.3, y: 0.86 };
const margin = 90;

interface BranchShape {
  angle: number;
  distance: number;
  spread: number;
  groupDistance: number;
  leafDistance: number;
  leafStep: number;
}

const shapes: Record<SkillBranch['id'], BranchShape> = {
  developpement: { angle: 180, distance: 560, spread: 300, groupDistance: 320, leafDistance: 185, leafStep: 34 },
  'ui-ux': { angle: -58, distance: 470, spread: 96, groupDistance: 230, leafDistance: 170, leafStep: 36 },
  'montage-video': { angle: 8, distance: 520, spread: 90, groupDistance: 220, leafDistance: 165, leafStep: 38 },
  graphisme: { angle: 66, distance: 470, spread: 96, groupDistance: 230, leafDistance: 170, leafStep: 36 },
};

export type NodeKind = 'root' | 'branch' | 'group' | 'skill';

export interface TreeNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  parent?: string;
  branch?: SkillBranch['id'];
}

const rad = (deg: number) => (deg * Math.PI) / 180;

const polar = (origin: { x: number; y: number }, angle: number, distance: number) => ({
  x: origin.x + Math.cos(rad(angle)) * distance * scale.x,
  y: origin.y + Math.sin(rad(angle)) * distance * scale.y,
});

const fan = (centerAngle: number, step: number, count: number) =>
  Array.from({ length: count }, (_, i) => centerAngle + (i - (count - 1) / 2) * step);

const spreadAngles = (centerAngle: number, spread: number, count: number) =>
  count === 1 ? [centerAngle] : Array.from({ length: count }, (_, i) => centerAngle - spread / 2 + (spread * i) / (count - 1));

const nodes: TreeNode[] = [{ id: 'root', kind: 'root', ...center }];
const ideal = new Map<string, { x: number; y: number }>();

for (const branch of skillTree) {
  const shape = shapes[branch.id];
  const branchPos = polar(center, shape.angle, shape.distance);
  nodes.push({ id: branch.id, kind: 'branch', parent: 'root', branch: branch.id, ...branchPos });

  const groupAngles = spreadAngles(shape.angle, shape.spread, branch.groups.length);
  branch.groups.forEach((group, gi) => {
    const groupAngle = groupAngles[gi];
    const groupPos = polar(branchPos, groupAngle, shape.groupDistance);
    const groupId = `${branch.id}:${group.id}`;
    nodes.push({ id: groupId, kind: 'group', parent: branch.id, branch: branch.id, ...groupPos });

    fan(groupAngle, shape.leafStep, group.skills.length).forEach((leafAngle, li) => {
      const pos = polar(groupPos, leafAngle, shape.leafDistance);
      const id = group.skills[li].id;
      ideal.set(id, pos);
      nodes.push({ id, kind: 'skill', parent: groupId, branch: branch.id, ...pos });
    });
  });
}

const room: Record<NodeKind, { x: number; y: number }> = {
  root: { x: 260, y: 220 },
  branch: { x: 240, y: 120 },
  group: { x: 150, y: 70 },
  skill: { x: 128, y: 104 },
};

for (let step = 0; step < 220; step++) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const rx = (room[a.kind].x + room[b.kind].x) / 2;
      const ry = (room[a.kind].y + room[b.kind].y) / 2;
      const dx = (b.x - a.x) / rx;
      const dy = (b.y - a.y) / ry;
      const d = Math.hypot(dx, dy);
      if (d >= 1) continue;
      const push = (1 - d) / 2;
      const ux = d === 0 ? 1 : dx / d;
      const uy = d === 0 ? 0 : dy / d;
      const moveA = a.kind === 'skill' ? 1 : a.kind === 'group' ? 0.35 : 0;
      const moveB = b.kind === 'skill' ? 1 : b.kind === 'group' ? 0.35 : 0;
      const total = moveA + moveB || 1;
      a.x -= ((ux * push * rx * 2) * moveA) / total;
      a.y -= ((uy * push * ry * 2) * moveA) / total;
      b.x += ((ux * push * rx * 2) * moveB) / total;
      b.y += ((uy * push * ry * 2) * moveB) / total;
    }
  }
  for (const node of nodes) {
    const target = ideal.get(node.id);
    if (target) {
      node.x += (target.x - node.x) * 0.02;
      node.y += (target.y - node.y) * 0.02;
    }
    node.x = Math.min(world.width - margin, Math.max(margin, node.x));
    node.y = Math.min(world.height - margin, Math.max(margin, node.y));
  }
}

for (const node of nodes) {
  node.x = Math.round(node.x);
  node.y = Math.round(node.y);
}

export const treeNodes = nodes;

export const nodeById = new Map(nodes.map((node) => [node.id, node]));

export const treeLinks = nodes
  .filter((node) => node.parent)
  .map((node) => {
    const parent = nodeById.get(node.parent!)!;
    return { from: parent, to: node, kind: node.kind };
  });

const bounds = (members: TreeNode[], pad: number) => {
  const xs = members.map((node) => node.x);
  const ys = members.map((node) => node.y);
  const x = Math.min(...xs) - pad;
  const y = Math.min(...ys) - pad;
  return { x, y, width: Math.max(...xs) + pad - x, height: Math.max(...ys) + pad - y };
};

export const contentBounds = bounds(nodes, 120);

export const branchBounds = Object.fromEntries(
  skillTree.map((branch) => {
    const members = nodes.filter((node) => node.branch === branch.id);
    return [branch.id, bounds(members, 110)];
  }),
) as Record<SkillBranch['id'], { x: number; y: number; width: number; height: number }>;
