// Node frontmatter type reference
// See src/content/config.ts for the Zod schema definition
//
// Example frontmatter in each .md file:
// ---
// id: binary-numbers
// title: 二进制数字
// summary: 二进制是计算机中最基础的数值表示方式
// difficulty: beginner
// order: 1
// parent: null
// children:
//   - boolean-algebra
// related:
//   - set-theory
// prerequisites: []
// tags:
//   - math
//   - hardware
// ---

export type NodeDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface NodeFrontmatter {
  id: string;
  title: string;
  summary: string;
  difficulty: NodeDifficulty;
  order: number;
  parent?: string;
  children: string[];
  related: string[];
  prerequisites: string[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
