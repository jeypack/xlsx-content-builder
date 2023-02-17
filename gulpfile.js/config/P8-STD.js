const { XLSX_TYPE_ENUM } = require("../parser/XLSXParserEnum");

const TPL_NAMES = {
  CLIENT: "P&G",
  BRAND: ["Pampers", "Pampers"],
  PRODUCT: [
    "P8-Std",
    "P8-Std",
  ],
  TYPE: [
    "Size-3-6",
    "Size-0-2",
  ],
  LANGUAGE: [
    ["CZ", "SK"],
    ["CZ", "SK"],
  ],
  //every language may have more than 1 version
  //here we keep version length for every language entry
  //e.g. TPL_NAMES.VERSION[CURRENT_LANGUAGE] = 1 means one version ...
  VERSION: [
    [1, 1],
    [1, 1],
  ],
  FLEX_COLS: [
    [6, 6],
    [6, 6],
  ],
  BODY_CLASS: [
    ["mobile", "mobile"],
    ["mobile", "mobile"],
  ],
  XLSX_PARSER: [
    XLSX_TYPE_ENUM.P_1_1_4_4_FLEX_6,
    XLSX_TYPE_ENUM.P_1_1_4_4_FLEX_6,
  ],
  CLIENT_VERSION: ["V01", "V01"],
  DATE: ["220324", "220324"],
  SIZE: "1195xAUTO",
  PREFIX: "HTML5",
  SUFFIX: "",
};

module.exports.TPL_NAMES = TPL_NAMES;