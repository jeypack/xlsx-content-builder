const { XLSX_TYPE_ENUM } = require("../parser/XLSXParserEnum");

const TPL_NAMES = {
  CLIENT: "P&G",
  BRAND: ["OralB", "OralB", "OralB"],
  PRODUCT: ["Genesis5", "Genesis5", "Genesis5"],
  TYPE: ["Vitality-Pro", "Pro-3", "KIDS-Lightyear"],
  LANGUAGE: [
    ["CZ", "HU", "PL", "SK"],
    ["CZ", "HU", "PL", "SK"],
    ["CZ", "HU", "PL", "SK"],
  ],
  //every language may have more than 1 sujet
  //CURRENT_SUJET of gulp-config keeps track of inside index
  SUJET: [
    [["S1"], ["S1"], ["S1"], ["S1"]],
    [["S1"], ["S1"], ["S1", "S2", "S3"], ["S1"]],
    [["S1"], ["S1"], ["S1"], ["S1"]],
  ],
  BODY_CLASS: [
    ["mobile", "mobile", "mobile", "mobile"],
    ["mobile", "mobile", "mobile", "mobile"],
    ["mobile", "mobile", "mobile", "mobile"],
  ],
  //old: XLSX_TYPE_ENUM.P_1_4_4_1_FLEX_3,
  XLSX_PARSER: [
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
  ],
  CLIENT_VERSION: ["V01", "V01", "V01"],
  DATE: ["220613", "220613", "220626"],
  CURRENT_TPL_VERSION: "LANG_VERSION", //@see getTplNameFunction
  SIZE: "1195xAUTO",
  PREFIX: "HTML5",
  SUFFIX: "web_2022_06",
};

module.exports.TPL_NAMES = TPL_NAMES;
