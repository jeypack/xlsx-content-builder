const { XLSX_TYPE_ENUM } = require("../parser/XLSXParserEnum");

const TPL_NAMES = {
  CLIENT: "P&G",
  //HERE WE GET LENGTH VOR CALCULATIONS
  BRAND: ["pampers", "pampers"],
  PRODUCT: ["Paw-Patrol", "Paw-Patrol"],
  TYPE: ["BabyDry-Pants", "BabyDry-Pants"],
  LANGUAGE: [["CZ", "SK"]],
  //every language may have more than 1 sujet
  //CURRENT_SUJET of gulp-config keeps track of inside index
  SUJET: [
    [["S1"], ["S1"]],
    [["S1"], ["S1"]],
  ],
  //we need client version min for every language
  //better also for every sujet too
  CLIENT_VERSION: [
    [["V01"], ["V01"]],
    [["V01"], ["V01"]],
  ],
  BODY_CLASS: [
    ["mobile", "mobile"],
    ["mobile", "mobile"],
  ],
  //STANDARD_LAYOUT: ["StandardFlexLayout", "StandardFlexLayout", "StandardFlexLayout"],
  XLSX_PARSER: [
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
  ],
  DATE: ["230309", "230309", "230309"],
  CURRENT_TPL_VERSION: "LANG_VERSION", //@see getTplNameFunction
  SIZE: "1195xAUTO",
  PREFIX: "HTML5",
  SUFFIX: "web_2023_03",
};

module.exports.TPL_NAMES = TPL_NAMES;
