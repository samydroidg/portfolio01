import { readFileSync } from 'fs';
import { resolve } from 'path';

function readJson(sourceDir, file) {
  return JSON.parse(readFileSync(resolve(sourceDir, file), 'utf8'));
}

function stripProtocol(url) {
  return String(url || '').replace(/^[a-z]+:\/\//i, '').replace(/^mailto:/i, '');
}

function socialUrl(socials, label) {
  const entry = socials.find((s) => s.label.toLowerCase() === label.toLowerCase());
  return entry ? stripProtocol(entry.url) : '';
}

const DEFAULT_SKILL_SECTIONS = [
  { title: 'Frontend', categories: ['frontend'] },
  { title: 'Backend', categories: ['backend'] },
  { title: 'Database', categories: ['database'] },
  { title: 'Tools', categories: ['tools'] },
  { title: 'Languages', categories: ['languages'] },
];

export function loadResumeData(sourceDir) {
  const resume = readJson(sourceDir, 'resume.json');
  const portfolio = readJson(sourceDir, 'portfolio.json');
  const socials = readJson(sourceDir, 'socials.json');
  const projects = readJson(sourceDir, 'projects.json');
  const skills = readJson(sourceDir, 'skills.json');
  const achievements = readJson(sourceDir, 'achievements.json');

  const personal = portfolio.personal ?? {};
  const contact = {
    name: personal.name ?? 'Gourav Ojha',
    location: resume.contact?.location ?? personal.location ?? '',
    email: resume.contact?.email ?? socialUrl(socials, 'email') ?? '',
    github: resume.contact?.github ?? socialUrl(socials, 'github') ?? '',
    linkedin: resume.contact?.linkedin ?? socialUrl(socials, 'linkedin') ?? '',
    website: resume.contact?.website ?? '',
  };

  const skillsByCategory = new Map();
  for (const item of skills.items ?? []) {
    if (!skillsByCategory.has(item.category)) {
      skillsByCategory.set(item.category, []);
    }
    skillsByCategory.get(item.category).push(item.name);
  }

  const sections = (resume.skillSections ?? DEFAULT_SKILL_SECTIONS)
    .map((sectionDef) => ({
      title: sectionDef.title,
      skills: (sectionDef.categories ?? []).flatMap(
        (category) => skillsByCategory.get(category) ?? [],
      ),
    }))
    .filter((sectionDef) => sectionDef.skills.length > 0);

  const selected =
    resume.projects === 'all'
      ? projects
      : projects.filter((project) => (resume.projects ?? []).includes(project.slug));

  return {
    name: contact.name,
    headline: resume.headline ?? (personal.titles ?? []).join(' • '),
    summary: resume.summary ?? personal.bio ?? '',
    contact,
    stats: resume.stats === false ? [] : (achievements ?? []),
    education: resume.education ?? [],
    competencies: resume.competencies ?? [],
    availability: resume.availability ?? [],
    skillSections: sections,
    projects: selected.map((project) => ({
      name: project.name,
      category: project.category,
      overview: project.overview,
      techStack: (project.techStack ?? []).map((tech) => tech.name),
    })),
  };
}
