const { XLSX_TYPE_ENUM } = require("./gulp-xlsx-helper.js");

const config = {
  UID: 0,
  DEVELOPMENT: true,
  HAS_FOLDER_TO_ZIP: false,
  //PATH_INCLUDES_SASS: ['bower_components/juiced/sass/'],
  HTDOCS_PATH: "/Applications/MAMP/htdocs/",
  SRC_PATH: "./src/xlsx-template/",
  SRC_VENDOR: "./src/vendor/",
  DEV_FOLDER: "./_temp/",
  BUILD_FOLDER: "./_build/",
  CLIENT: "P&G",
  // PREFIX_BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_SIZE_CLIENT_VERSION_DATE
  //e.g. HTML5_OralB_Genesis5_KIDS-Lightyear_HU_V1_1195xAUTO_V01_220626
  TPL_NAMES: {
    BRAND: ["OralB", "OralB"],
    PRODUCT: ["Genesis5", "Genesis5"],
    TYPE: ["KIDS-Lightyear", "KIDS-Lightyear"],
    LANGUAGE: [
      ["CZ", "HU", "PL", "SK"],
      ["CZ", "HU", "PL", "SK"],
    ],
    //every language may have more than 1 version
    //here we keep version length for every language entry
    //e.g. TPL_NAMES.VERSION[CURRENT_LANGUAGE] = 1 means one version ...
    VERSION: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ],
    FLEX_COLS: [
      [3, 3, 3, 3],
      [3, 3, 3, 3],
    ],
    CLIENT_VERSION: ["V01", "V01"],
    BODY_CLASS: [
      ["mobile", "mobile", "mobile", "mobile"],
      ["mobile", "mobile", "mobile", "mobile"],
    ],
    XLSX_PARSER: [
      XLSX_TYPE_ENUM.ORAL_B_KIDS_1_4_4_1_FLEX_3,
      XLSX_TYPE_ENUM.ORAL_B_KIDS_1_4_4_1_FLEX_3,
    ],
    DATE: ["220626", "220626"],
    SIZE: "1195xAUTO",
    PREFIX: "HTML5",
    SUFFIX: "",
  },
  //
  CURRENT: 0,
  CURRENT_LANGUAGE: 0,
  CURRENT_VERSION: 0,
  CURRENT_TPL_VERSION: "LANG",
  destination: "./_temp/",
};

module.exports.config = config;
