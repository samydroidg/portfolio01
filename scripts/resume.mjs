import { generate } from './resume/index.mjs';

const flag = process.argv.find((arg) => arg.startsWith('--style='));
const styleName = flag ? flag.split('=')[1] : null;

generate(styleName);
