const { XLSX_TYPE_ENUM } = require("../parser/XLSXParserEnum");

const TPL_NAMES = {
  CLIENT: "P&G",
  BRAND: ["OralB", "OralB", "OralB"],
  PRODUCT: [
    "Genesis5",
    "Genesis5",
    "Genesis5",
  ],
  TYPE: [
    "Vitality-Pro",
    "Pro-3",
    "KIDS-Lightyear",
  ],
  LANGUAGE: [
    ["CZ", "HU", "PL", "SK"],
    ["CZ", "HU", "PL", "SK"],
    ["CZ", "HU", "PL", "SK"],
  ],
  //every language may have more than 1 version
  //here we keep version length for every language entry
  //e.g. TPL_NAMES.VERSION[CURRENT_LANGUAGE] = 1 means one version ...
  VERSION: [
    [1, 1, 1, 1],
    [1, 1, 3, 1],
    [1, 1, 1, 1],
  ],
  FLEX_COLS: [
    [4, 4, 4, 4],
    [4, 4, 4, 4],
    [3, 3, 3, 3],
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
  SIZE: "1195xAUTO",
  PREFIX: "HTML5",
  SUFFIX: "",
};

module.exports.TPL_NAMES = TPL_NAMES;