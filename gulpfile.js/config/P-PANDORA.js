const { XLSX_TYPE_ENUM } = require("../parser/XLSXParserEnum");

const TPL_NAMES = {
  CLIENT: "P&G",
  BRAND: ["Pampers", "Pampers", "Pampers", "Pampers", "Pampers"],
  PRODUCT: ["Pandora", "Pandora", "Pandora", "Pandora", "Pandora"],
  TYPE: [
    "Sensitive0Perc",
    "Harmonie-Aqua0Perc",
    "Harmonie-Coco0Perc",
    "Fresh-Clean",
    "Sensitive",
  ],
  LANGUAGE: [
    ["CZ", "SK"],
    ["CZ", "SK"],
    ["CZ", "SK"],
    ["CZ", "SK"],
    ["CZ", "SK"],
  ],
  //every language may have more than 1 sujet
  //CURRENT_SUJET of gulp-config keeps track of inside index
  SUJET: [
    [["S1"], ["S1"]],
    [["S1"], ["S1"]],
    [["S1"], ["S1"]],
    [["S1"], ["S1"]],
    [["S1"], ["S1"]],
  ],
  //we need client version min for every language
  //better also for every sujet too
  CLIENT_VERSION: [
    [["V01"], ["V01"]],
    [["V01"], ["V01"]],
    [["V01"], ["V01"]],
    [["V01"], ["V01"]],
    [["V01"], ["V01"]],
  ],
  BODY_CLASS: [
    ["mobile", "mobile"],
    ["mobile", "mobile"],
    ["mobile", "mobile"],
    ["mobile", "mobile"],
    ["mobile", "mobile"],
  ],
  //STANDARD_LAYOUT: ["StandardFlexLayout", "StandardFlexLayout", "StandardFlexLayout"],
  XLSX_PARSER: [
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
  ],
  DATE: ["230214", "230214", "230214", "230214", "230214"],
  CURRENT_TPL_VERSION: "LANG_VERSION", //@see getTplNameFunction
  SIZE: "1195xAUTO",
  PREFIX: "HTML5",
  SUFFIX: "web_2023_02",
};

module.exports.TPL_NAMES = TPL_NAMES;
