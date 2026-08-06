export function getLayout(doc, opts = {}) {
  const m = doc.page.margins;
  const footerHeight = opts.footerHeight ?? doc._resumeFooterHeight ?? 0;
  const maxY = doc.page.height - m.bottom;
  return {
    top: m.top,
    bottom: m.bottom,
    left: m.left,
    right: m.right,
    width: doc.page.width,
    height: doc.page.height,
    maxY,
    contentWidth: doc.page.width - m.left - m.right,
    contentRight: doc.page.width - m.right,
    contentBottom: maxY - footerHeight,
  };
}

export function addPage(doc, layout) {
  doc.addPage();
  doc.x = layout.left;
  doc.y = layout.top;
}

export function ensureSpace(doc, layout, height) {
  if (doc.y + height > layout.contentBottom) {
    addPage(doc, layout);
  }
}
