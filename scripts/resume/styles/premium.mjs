import { theme } from '../theme.mjs';
import { text, paragraph, section, bullets, columns } from '../helpers/draw.mjs';
import { getLayout, ensureSpace } from '../layout.mjs';

function contactLine(contact) {
  return [contact.location, contact.email, contact.github, contact.linkedin, contact.website]
    .filter(Boolean)
    .join('  •  ');
}

function renderHeader(doc, data) {
  text(doc, data.name, {
    variant: 'bold',
    size: theme.type.name,
    color: theme.palette.ink,
    lineGap: 2,
  });
  doc.y += 2;
  text(doc, data.headline, {
    variant: 'regular',
    size: theme.type.headline,
    color: theme.palette.text,
  });
  doc.y += 2;
  const contact = contactLine(data.contact);
  if (contact) {
    text(doc, contact, { variant: 'regular', size: theme.type.contact, color: theme.palette.muted });
    doc.y += 2;
  }
  if (data.stats.length) {
    const statsLine = data.stats
      .map((stat) => `${stat.label}: ${stat.value}${stat.suffix ?? ''}`)
      .join('  •  ');
    text(doc, statsLine, { variant: 'regular', size: theme.type.stats, color: theme.palette.accent });
    doc.y += 2;
  }
}

function renderProjects(doc, projects, layout) {
  for (const project of projects) {
    ensureSpace(doc, layout, 26);
    text(doc, `${project.name} — ${project.category}`, {
      variant: 'bold',
      size: theme.type.projectName,
      color: theme.palette.ink,
    });
    doc.y += 1.5;
    paragraph(doc, project.overview, { size: theme.type.projectBody, lineGap: 2 });
    if (project.techStack.length) {
      text(doc, `Tech Stack: ${project.techStack.join(', ')}`, {
        variant: 'oblique',
        size: theme.type.stack,
        color: theme.palette.accent,
      });
    }
    doc.y += theme.spacing.projectGap;
  }
}

function renderEducation(doc, education) {
  for (const edu of education) {
    text(doc, edu.degree, { variant: 'bold', size: theme.type.body, color: theme.palette.ink });
    if (edu.school) {
      text(doc, edu.school, { variant: 'regular', size: theme.type.body, color: theme.palette.text });
    }
    if (edu.period) {
      text(doc, edu.period, { variant: 'regular', size: theme.type.body, color: theme.palette.muted });
    }
    doc.y += 4;
  }
}

function installFooter(doc, layout, data, lineHeight) {
  const FOOTER_CUSHION = 1;
  let pageNumber = 0;
  const drawFooter = () => {
    pageNumber += 1;
    const x = doc.x;
    const y = doc.y;
    const footerTop = layout.maxY - lineHeight - FOOTER_CUSHION;
    doc.save();
    doc
      .font(theme.fonts.regular)
      .fontSize(theme.type.footer)
      .fillColor(theme.palette.muted)
      .text(`${data.name} — ${pageNumber}`, layout.left, footerTop, {
        width: layout.contentWidth,
        align: 'center',
      });
    doc.restore();
    doc.x = x;
    doc.y = y;
  };
  drawFooter();
  doc.on('pageAdded', drawFooter);
}

function render(doc, _layout, data) {
  doc.font(theme.fonts.regular).fontSize(theme.type.footer);
  const lineHeight = doc.currentLineHeight(true);
  doc._resumeFooterHeight = lineHeight + 4;
  const layout = getLayout(doc);

  installFooter(doc, layout, data, lineHeight);

  renderHeader(doc, data);

  section(doc, 'Professional Summary');
  paragraph(doc, data.summary, {});

  section(doc, 'Featured Projects');
  renderProjects(doc, data.projects, layout);

  section(doc, 'Technical Skills');
  bullets(
    doc,
    data.skillSections.map((item) => `${item.title}: ${item.skills.join(', ')}`),
    {},
  );

  section(doc, 'Core Competencies');
  columns(doc, data.competencies, {});

  section(doc, 'Education');
  renderEducation(doc, data.education);

  section(doc, 'Availability');
  bullets(doc, data.availability, {});
}

export const premium = {
  name: 'premium',
  fileName: 'resume.pdf',
  pageSize: 'A4',
  margins: { top: 48, bottom: 56, left: 50, right: 50 },
  info: (data) => ({
    Title: `${data.name} — Resume`,
    Author: data.name,
    Subject: `${data.headline} Resume`,
    Keywords: [data.name, data.headline, ...data.projects.map((project) => project.name)].join(', '),
  }),
  render,
};