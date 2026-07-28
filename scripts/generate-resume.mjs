import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

const __dirname = resolve();
const out = resolve(__dirname, 'public', 'resume.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 56, bottom: 56, left: 56, right: 56 },
  info: {
    Title: 'Gourav Ojha — Resume',
    Author: 'Gourav Ojha',
    Subject: 'Product Engineer Resume',
  },
});

doc.pipe(createWriteStream(out));

const accent = '#6366f1';
const gray = '#52525b';
const light = '#a1a1aa';

// ─── Header ───
doc.font('Helvetica-Bold').fontSize(28).fillColor('#09090b').text('Gourav Ojha', { continued: false });
doc.font('Helvetica').fontSize(13).fillColor(gray).text('Product Engineer  ·  Full Stack Developer', { continued: false });
doc.fontSize(10).fillColor(light)
  .text('India  ·  gourav@email.com  ·  github.com/gourav  ·  linkedin.com/in/gourav')
  .moveDown(0.3);

// Divider
doc.moveTo(56, doc.y).lineTo(534, doc.y).strokeColor('#e4e4e7').lineWidth(1).stroke();
doc.moveDown(0.8);

// ─── Summary ───
section(doc, 'Summary');
doc.font('Helvetica').fontSize(10).fillColor(gray)
  .text(
    'Product Engineer who builds scalable digital products with modern technologies. ' +
    'Experienced in full-stack development, SaaS architecture, and building production-ready applications ' +
    'across transportation, healthcare, education, and fitness domains.',
    { align: 'left', lineGap: 4 }
  );
doc.moveDown(1);

// ─── Projects ───
section(doc, 'Projects');

projects(doc, 'Flysta', 'Enterprise SaaS', 'Transportation & Logistics',
  'Transportation Management System for managing logistics workflows — LR creation, manifest management, real-time tracking, POD delivery, role-based access, and reporting.',
  ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'PostgreSQL', 'JWT']);

projects(doc, 'Forgeo', 'Developer Growth Platform', 'EdTech',
  'Mission-based learning platform that teaches engineering thinking through real-world challenges rather than tutorials. Interactive coding challenges, progress tracking, skill gap analysis.',
  ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL']);

projects(doc, 'NutriLab', 'Healthcare SaaS', 'Healthcare',
  'Complete clinic management platform for nutritionists. Patient registration, appointment scheduling, meal planning, PDF prescriptions with QR verification, multi-role access (6 roles).',
  ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'JWT']);

projects(doc, 'FitFlow', 'Desktop Software', 'Fitness',
  'Offline-first gym management desktop app built with Electron. Member management, attendance, billing, trainer scheduling, local SQLite with future cloud sync.',
  ['Electron', 'React', 'TypeScript', 'Prisma', 'SQLite']);

// ─── Skills ───
doc.moveDown(0.5);
section(doc, 'Skills');
doc.font('Helvetica').fontSize(10).fillColor(gray);
doc.text('Frontend:  React, TypeScript, Tailwind CSS, JavaScript, HTML & CSS', { lineGap: 4 });
doc.text('Backend:   Node.js, Express.js, REST API Design', { lineGap: 4 });
doc.text('Database:  PostgreSQL, Supabase, SQLite, Prisma', { lineGap: 4 });
doc.text('Tools:     Git, GitHub, VS Code, Figma, Electron', { lineGap: 4 });
doc.text('Languages: JavaScript, TypeScript, Python', { lineGap: 4 });
doc.moveDown(1);

// ─── Journey ───
section(doc, 'Engineering Journey');
const journey = [
  ['2021', 'Began Programming', 'Started learning programming fundamentals.'],
  ['2022', 'Web Development Foundations', 'Learned HTML, CSS, JavaScript. Built interactive pages.'],
  ['2023', 'React & Modern Frontend', 'Component-based architecture, state management, routing.'],
  ['2024', 'Full-Stack Development', 'Node.js, Express, PostgreSQL. End-to-end application development.'],
  ['2025', 'Building Production Products', 'SaaS applications for logistics, healthcare, and education.'],
  ['2026', 'Deepening Engineering Expertise', 'System design, backend scalability, AI integration.'],
];
journey.forEach(([year, title, desc]) => {
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#09090b').text(`${year}  ${title}`, { lineGap: 2 });
  doc.font('Helvetica').fontSize(9).fillColor(gray).text(desc, { lineGap: 4 });
});

// ─── Footer ───
doc.moveDown(2);
doc.fontSize(8).fillColor(light).text('Generated from portfolio data · gourav.dev', { align: 'center' });

doc.end();
console.log('Resume generated: public/resume.pdf');

// ─── Helpers ───
function section(doc, title) {
  doc.font('Helvetica-Bold').fontSize(11).fillColor(accent).text(title, { lineGap: 6 });
}

function projects(doc, name, category, industry, description, tech) {
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#09090b').text(`${name}  —  ${category}`, { lineGap: 2 });
  doc.font('Helvetica').fontSize(9).fillColor(light).text(`${industry}`, { lineGap: 4 });
  doc.font('Helvetica').fontSize(9.5).fillColor(gray).text(description, { lineGap: 4 });
  doc.font('Helvetica').fontSize(8).fillColor(accent).text(`Stack: ${tech.join(' · ')}`, { lineGap: 8 });
}
