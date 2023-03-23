
//const { series, parallel } = require("gulp");
const { XLSX_TYPE_ENUM } = require("../parser/XLSXParserEnum");

const TPL_NAMES = {
  CLIENT: "P&G",
  //BRAND_PRODUCT_TYPE_DATE
  //Pampers_P8-Std_Size-3-6_220324
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
  //every language may have more than 1 sujet
  //CURRENT_SUJET of gulp-config keeps track of inside index
  SUJET: [
    [["S1"], ["S1"], ["S1"], ["S1"]],
    [["S1"], ["S1"], ["S1"], ["S1"]],
  ],
  //we need client version min for every language
  //better also for every sujet too
  CLIENT_VERSION: [
    [["V01"], ["V01"], ["V01"], ["V01"]],
    [["V01"], ["V01"], ["V01"], ["V01"]],
  ],
  BODY_CLASS: [
    ["mobile", "mobile"],
    ["mobile", "mobile"],
  ],
  XLSX_PARSER: [
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
    XLSX_TYPE_ENUM.PARSER_STD_MODULE,
  ],
  DATE: ["220324", "220324"],
  CURRENT_TPL_VERSION: "LANG_VERSION", //@see getTplNameFunction
  SIZE: "1195xAUTO",
  PREFIX: "HTML5",
  SUFFIX: "web_2022_03",
};

module.exports.TPL_NAMES = TPL_NAMES;