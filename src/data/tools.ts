export const tools = {
  react: { name: 'React', icon: 'react' },
  nextjs: { name: 'Next.js', icon: 'nextjs' },
  angular: { name: 'Angular', icon: 'angular' },
  astro: { name: 'Astro', icon: 'astro' },
  wordpress: { name: 'WordPress', icon: 'wordpress' },
  elementor: { name: 'Elementor', icon: 'elementor' },
  javascript: { name: 'JavaScript', icon: 'javascript' },
  typescript: { name: 'TypeScript', icon: 'typescript' },
  express: { name: 'Express', icon: 'expressjs' },
  fastify: { name: 'Fastify', icon: 'fastify' },
  spring: { name: 'Java Spring', icon: 'spring' },
  php: { name: 'PHP', icon: 'php' },
  expo: { name: 'Expo React Native', icon: 'expo' },
  flutter: { name: 'Flutter', icon: 'flutter' },
  kotlin: { name: 'Kotlin', icon: 'kotlin' },
  swing: { name: 'Java Swing', icon: 'java' },
  wpf: { name: 'C# .NET WPF', icon: 'cs' },
  electron: { name: 'Electron', icon: 'electron' },
  postgresql: { name: 'PostgreSQL', icon: 'postgresql' },
  prisma: { name: 'Prisma', icon: 'prisma' },
  firebase: { name: 'Firebase', icon: 'firebase' },
  clerk: { name: 'Clerk', icon: 'clerk' },
  stripe: { name: 'Stripe', icon: 'stripe' },
  cloudflare: { name: 'Cloudflare R2', icon: 'cloudflare' },
  railway: { name: 'Railway', icon: 'railway' },
  git: { name: 'Git', icon: 'git' },
  docker: { name: 'Docker', icon: 'docker' },
  kubernetes: { name: 'Kubernetes', icon: 'kubernetes' },
  figma: { name: 'Figma', icon: 'figma' },
  photoshop: { name: 'Photoshop', icon: 'photoshop' },
  illustrator: { name: 'Illustrator', icon: 'illustrator' },
  premiere: { name: 'Premiere Pro', icon: 'premiere' },
  aftereffects: { name: 'After Effects', icon: 'aftereffects' },
} as const satisfies Record<string, { name: string; icon: string }>;

export type ToolId = keyof typeof tools;

export const toolIds = Object.keys(tools) as [ToolId, ...ToolId[]];

export const toolName = (id: ToolId) => tools[id].name;
