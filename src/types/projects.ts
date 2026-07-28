export interface TechItem {
  name: string;
  category: string;
}

export interface RoadmapItem {
  title: string;
  status: 'planned' | 'future' | 'completed';
}

export interface ProjectData {
  id: string;
  slug: string;
  name: string;
  category: string;
  industry: string;
  status: string;
  coverImage: string;
  accentColor: string;
  overview: string;
  mission: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: TechItem[];
  architecture: string;
  challenges: string[];
  engineeringDecisions: string[];
  lessonsLearned: string[];
  roadmap: RoadmapItem[];
  gallery: string[];
  github: string;
  liveDemo: string;
}
