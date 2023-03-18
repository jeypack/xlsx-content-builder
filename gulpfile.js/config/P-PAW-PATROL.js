const { XLSX_TYPE_ENUM } = require("../parser/XLSXParserEnum");

const TPL_NAMES = {
  CLIENT: "P&G",
  //HERE WE GET LENGTH VOR CALCULATIONS
  BRAND: ["pampers", "pampers"],
  PRODUCT: ["Paw-Patrol", "Paw-Patrol"],
  TYPE: ["BabyDry-Pants", "BabyDry-Pants"],
  LANGUAGE: [["CZ", "SK"]],
  //every language may have more than 1 version
  //here we keep version length for every language entry
  //e.g. TPL_NAMES.VERSION[CURRENT_LANGUAGE] = 1 means one version ...
  VERSION: [
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
  ],
  //@see gulp-config.js -> getFLexCols() - now via XLSXParser ->numSliderCols
  //TODO: remove in future versions
  FLEX_COLS: [
    [6, 6],
    [6, 6],
    [6, 6],
    [6, 6],
    [6, 6],
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
  CLIENT_VERSION: ["V01", "V01", "V01", "V01", "V01"],
  DATE: ["230309", "230309", "230309", "230309", "230309"],
  SIZE: "1195xAUTO",
  PREFIX: "HTML5",
  SUFFIX: "web_2023_03",
};

module.exports.TPL_NAMES = TPL_NAMES;
