//const log = require('fancy-log');
//const { bold, dim, cyan, blue, red, green, magenta, grey, white, redBright, cyanBright, greenBright, blueBright, bgMagenta } = require('ansi-colors');

// DYNAMIC CONTENT EXPORT
const template = require('./gulp-xlsx-builder.js');
exports.default = template.default;
exports.build = template.build;
exports.dev = template.dev;
exports.html = template.html;
exports.zip = template.zip;
