import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { SOURCE_DIR, STYLES } from './config.mjs';
import { loadResumeData } from './data/normalize.mjs';
import { getLayout } from './layout.mjs';

export function generate(styleName) {
  const data = loadResumeData(SOURCE_DIR);
  const styles = styleName
    ? STYLES.filter((style) => style.name === styleName)
    : STYLES;

  for (const style of styles) {
    const doc = new PDFDocument({
      size: style.pageSize,
      margins: style.margins,
      info: style.info(data),
    });
    const layout = getLayout(doc);
    doc.pipe(createWriteStream(resolve(SOURCE_DIR, style.fileName)));
    style.render(doc, layout, data);
    doc.end();
    console.log(`[resume]${styleName ? ` ${styleName}` : ''} -> ${style.fileName}`);
  }
}