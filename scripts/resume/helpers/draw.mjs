import { theme } from '../theme.mjs';
import { getLayout, ensureSpace } from '../layout.mjs';

export function text(doc, value, opts = {}) {
  const layout = getLayout(doc);
  const {
    variant = 'regular',
    color = theme.palette.text,
    size,
    lineGap = 0,
    align = 'left',
    x,
    y,
    width,
  } = opts;
  doc.font(theme.fonts[variant]).fontSize(size).fillColor(color);
  doc.text(value, x ?? layout.left, y ?? doc.y, {
    width: width ?? layout.contentWidth,
    lineGap,
    align,
  });
  return doc;
}

export function paragraph(doc, value, opts = {}) {
  const layout = getLayout(doc);
  const {
    variant = 'regular',
    size = theme.type.body,
    color = theme.palette.text,
    lineGap = 2,
    align = 'left',
  } = opts;
  doc.font(theme.fonts[variant]).fontSize(size).fillColor(color);
  const height = doc.heightOfString(value, { width: layout.contentWidth, lineGap, align });
  ensureSpace(doc, layout, height);
  doc.text(value, layout.left, doc.y, { width: layout.contentWidth, lineGap, align });
  return doc;
}

export function section(doc, title, opts = {}) {
  const layout = getLayout(doc);
  const { size = theme.type.sectionTitle, color = theme.palette.accent } = opts;
  ensureSpace(doc, layout, 26);
  text(doc, title, { variant: 'bold', size, color });
  const lineY = doc.y + 3;
  doc
    .moveTo(layout.left, lineY)
    .lineTo(layout.contentRight, lineY)
    .lineWidth(0.6)
    .strokeColor(theme.palette.hairline)
    .stroke();
  doc.y = lineY + 6;
}

export function bullets(doc, items, opts = {}) {
  const layout = getLayout(doc);
  const {
    variant = 'regular',
    size = theme.type.bullet,
    color = theme.palette.text,
    marker = '•',
    markerColor = theme.palette.accent,
    lineGap = 2,
    itemGap = 3,
  } = opts;
  doc.font(theme.fonts[variant]).fontSize(size).fillColor(color);
  const lineHeight = doc.currentLineHeight(true) + lineGap;
  const indent = size * 1.3;
  ensureSpace(doc, layout, Math.min(items.length * (lineHeight + itemGap), 260));
  for (const item of items) {
    const y = doc.y;
    doc
      .font(theme.fonts[variant])
      .fontSize(size)
      .fillColor(markerColor)
      .text(marker, layout.left, y, { lineBreak: false, width: 0 });
    doc
      .font(theme.fonts[variant])
      .fontSize(size)
      .fillColor(color)
      .text(item, layout.left + indent, y, { width: layout.contentWidth - indent, lineGap });
    doc.y += itemGap;
  }
  return doc;
}

export function columns(doc, items, opts = {}) {
  const layout = getLayout(doc);
  const {
    variant = 'regular',
    size = theme.type.competency,
    color = theme.palette.text,
    marker = '•',
    markerColor = theme.palette.accent,
    cols = 3,
    gap = 22,
    markerGap = 6,
    lineGap = 2,
  } = opts;
  const colWidth = (layout.contentWidth - gap * (cols - 1)) / cols;
  doc.font(theme.fonts[variant]).fontSize(size).fillColor(color);
  const markerWidth = doc.widthOfString(marker, { font: theme.fonts[variant], size }) + markerGap;
  const lineHeight = doc.currentLineHeight(true) + lineGap;
  const rows = Math.ceil(items.length / cols);
  const totalHeight = rows * lineHeight;
  ensureSpace(doc, layout, totalHeight);
  const startY = doc.y;
  items.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = layout.left + col * (colWidth + gap);
    const y = startY + row * lineHeight;
    doc
      .font(theme.fonts[variant])
      .fontSize(size)
      .fillColor(markerColor)
      .text(marker, x, y, { lineBreak: false, width: 0 });
    doc
      .font(theme.fonts[variant])
      .fontSize(size)
      .fillColor(color)
      .text(item, x + markerWidth, y, { width: colWidth - markerWidth, lineGap });
  });
  doc.y = startY + totalHeight;
  return doc;
}