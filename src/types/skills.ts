export interface SkillCategory {
  key: string;
  label: string;
}

export interface SkillItem {
  name: string;
  category: string;
}

export interface SkillsData {
  categories: SkillCategory[];
  items: SkillItem[];
}
