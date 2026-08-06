import { resolve } from 'path';
import { premium } from './styles/premium.mjs';

export const SOURCE_DIR = resolve(process.cwd(), 'public');

export const DATA_FILES = {
  resume: 'resume.json',
  portfolio: 'portfolio.json',
  projects: 'projects.json',
  skills: 'skills.json',
  socials: 'socials.json',
  achievements: 'achievements.json',
};

export const STYLES = [premium];