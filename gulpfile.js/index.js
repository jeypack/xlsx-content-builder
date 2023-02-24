//const log = require('fancy-log');
//const { bold, dim, cyan, blue, red, green, magenta, grey, white, redBright, cyanBright, greenBright, blueBright, bgMagenta } = require('ansi-colors');

// DYNAMIC CONTENT EXPORT
const template = require('./gulp-xlsx-builder.js');
exports.default = template.default;
exports.cleanAll = template.cleanAll;
exports.cleanBuild = template.cleanBuild;
exports.build = template.build;
exports.dev = template.dev;
exports.images = template.images;
exports.imagesFolderType = template.imagesFolderType;
//exports.zip = template.zip;
