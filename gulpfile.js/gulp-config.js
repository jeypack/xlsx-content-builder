const fs = require("fs");
const { XLSX_TYPE_ENUM } = require("./parser/XLSXParserEnum");

const TPL_ENUM = {
  STD: "NAME",
  LANG: "LANG",
  VERSION: "VERSION",
  LANG_VERSION: "LANG_VERSION",
};

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
    BRAND: ["OralB", "OralB", "OralB"],
    PRODUCT: ["Genesis5", "Genesis5", "Genesis5"],
    TYPE: ["Vitality-Pro", "Pro-3", "KIDS-Lightyear"],
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
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ],
    FLEX_COLS: [
      [4, 4, 4, 4],
      [4, 4, 4, 4],
      [3, 3, 3, 3],
    ],
    CLIENT_VERSION: ["V01", "V01"],
    BODY_CLASS: [
      ["mobile", "mobile", "mobile", "mobile"],
      ["mobile", "mobile", "mobile", "mobile"],
      ["mobile", "mobile", "mobile", "mobile"],
    ],
    XLSX_PARSER: [
      XLSX_TYPE_ENUM.P_1_4_4_1_FLEX_4,
      XLSX_TYPE_ENUM.P_1_4_4_1_FLEX_4,
      XLSX_TYPE_ENUM.P_1_4_4_1_FLEX_3,
    ],
    DATE: ["220613", "220613", "220626"],
    SIZE: "1195xAUTO",
    PREFIX: "HTML5",
    SUFFIX: "",
  },
  //
  CURRENT: 1,
  CURRENT_LANGUAGE: 0,
  CURRENT_VERSION: 0,
  CURRENT_TPL_VERSION: "LANG",
  destination: "./_temp/",
};

// HELPER FUNCTIONS GULP

const directoryContains = (path, doneFn, errorFn) => {
  fs.readdir(path, function (err, files) {
    if (err) {
      if (errorFn && typeof errorFn === "function") {
        errorFn(err);
      }
    } else {
      if (doneFn && typeof doneFn === "function") {
        doneFn({ files: files });
      }
    }
  });
};

const getTplNameFunction = () => {
  console.log("getTplNameFunction", "CURRENT_TPL_VERSION:", config.CURRENT_TPL_VERSION);
  switch (config.CURRENT_TPL_VERSION) {
    case TPL_ENUM.LANG:
      //images and scss for every language
      return getTplLangName;
    case TPL_ENUM.VERSION:
      //images and scss for every version
      return getTplVersionName;
    case TPL_ENUM.LANG_VERSION:
      //images and scss for every language and version
      return getTplLangVersionName;
    default:
      //same images and scss for all pages
      return getTplName;
  }
};
// BRAND_PRODUCT_TYPE_DATE
const getTplName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const name =
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index] +
    "_" +
    tplNames.DATE[index];
  console.log("getTplName", "NAME:", name);
  return name;
};
// BRAND_PRODUCT_TYPE_LANGUAGE_DATE
const getTplLangName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const name =
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index] +
    "_" +
    tplNames.LANGUAGE[index][languageIndex] +
    "_" +
    tplNames.DATE[index];
  console.log("getTplLangName", "NAME:", name);
  return name;
};
// BRAND_PRODUCT_TYPE_VERSION_DATE
const getTplVersionName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const versionIndex = config.CURRENT_VERSION;
  const name =
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index] +
    "_" +
    (versionIndex + 1) +
    "_" +
    tplNames.DATE[index];
  console.log("getTplVersionName", "NAME:", name);
  return name;
};
// BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_DATE
const getTplLangVersionName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const versionIndex = config.CURRENT_VERSION;
  const name =
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index] +
    "_" +
    tplNames.LANGUAGE[index][languageIndex] +
    "_" +
    (versionIndex + 1) +
    "_" +
    tplNames.DATE[index];
  console.log("getTplLangVersionName", "NAME:", name);
  return name;
};
//BRAND_PRODUCT_TYPE_DATE
const getZipName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const name =
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index];
  console.log("getZipName", "NAME:", name);
  return name;
};
//BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_DATE
const getXLSXName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const versionIndex = config.CURRENT_VERSION;
  const name =
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index] +
    "_" +
    tplNames.LANGUAGE[index][languageIndex] +
    "_" +
    (versionIndex + 1) +
    "_" +
    tplNames.DATE[index];
  //console.log("getXLSXName", "NAME:", name);
  return name;
};
//PREFIX_BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_SIZE_CLIENT_VERSION_DATE
const getOutputName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const versionIndex = config.CURRENT_VERSION;
  const name =
    tplNames.PREFIX +
    "_" +
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index] +
    "_" +
    tplNames.LANGUAGE[index][languageIndex] +
    "_" +
    (versionIndex + 1) +
    "_" +
    tplNames.SIZE +
    tplNames.CLIENT_VERSION[index] +
    "_" +
    tplNames.DATE[index];
  console.log("getOutputName", "NAME:", name);
  return name;
};
const getLanguage = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  return tplNames.LANGUAGE[index][languageIndex];
};
const geBodyClass = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  return tplNames.BODY_CLASS[index][languageIndex];
};
const geXlsxParser = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  return tplNames.XLSX_PARSER[index];
};
const getLanguageVersion = () => {
  return config.CURRENT_VERSION + 1;
};
const getFLexCols = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  return tplNames.FLEX_COLS[index][languageIndex];
};
const getVersion = () => {
  return "STD TPL V2.0.0 | 26.06.2022 | " + new Date().toDateString();
};
const extendTemplateVars = (obj) => {
  if (typeof obj !== "object") {
    obj = {};
  }
  //get template name function via enum
  const getTplNameFunc = getTplNameFunction();
  obj.version = getVersion();
  obj.title = getXLSXName();
  obj.template = getTplNameFunc();
  obj.language = getLanguage();
  obj.languageVersion = getLanguageVersion();
  obj.bodyClass = geBodyClass();
  obj.jsCssName = config.DEVELOPMENT
    ? "index.min"
    : "index." + config.UID + ".min";
  obj.flexSliderCols = getFLexCols();
  //console.log("extendTemplateVars", "obj:", obj);
  return obj;
};
/**
 * Gulp nex index iterator
 */
const nextIndex = () => {
  const tpls = config.TPL_NAMES;
  const length = tpls.BRAND.length;
  const languageLength = tpls.LANGUAGE[config.CURRENT].length;
  const versionLength = tpls.VERSION[config.CURRENT][config.CURRENT_LANGUAGE];
  const nextIndex = config.CURRENT + 1;
  const nextLanguageIndex = config.CURRENT_LANGUAGE + 1;
  const nextVersionIndex = config.CURRENT_VERSION + 1;
  if (nextVersionIndex < versionLength) {
    config.CURRENT_VERSION = nextVersionIndex;
  } else {
    config.CURRENT_VERSION = 0;
    if (nextLanguageIndex < languageLength) {
      config.CURRENT_LANGUAGE = nextLanguageIndex;
    } else {
      config.CURRENT_LANGUAGE = 0;
      if (nextIndex < length) {
        config.CURRENT = nextIndex;
      } else {
        return false;
      }
    }
  }
  console.log(
    "nextIndex",
    "CURRENT:",
    config.CURRENT,
    "CURRENT_LANGUAGE:",
    config.CURRENT_LANGUAGE,
    "CURRENT_VERSION:",
    config.CURRENT_VERSION
  );
  return true;
};

// config, directoryContains, getTplNameFunction, getTplName, getTplLangName, getTplVersionName, getTplLangVersionName, getZipName, getXLSXName, getOutputName, getLanguage, geBodyClass, geXlsxParser, getLanguageVersion, getFLexCols, getVersion, extendTemplateVars, nextIndex
module.exports.config = config;
module.exports.TPL_ENUM = TPL_ENUM;
module.exports.directoryContains = directoryContains;
module.exports.getTplNameFunction = getTplNameFunction;
module.exports.getTplName = getTplName;
module.exports.getTplLangName = getTplLangName;
module.exports.getTplVersionName = getTplVersionName;
module.exports.getTplLangVersionName = getTplLangVersionName;
module.exports.getZipName = getZipName;
module.exports.getXLSXName = getXLSXName;
module.exports.getOutputName = getOutputName;
module.exports.getLanguage = getLanguage;
module.exports.geBodyClass = geBodyClass;
module.exports.geXlsxParser = geXlsxParser;
module.exports.getLanguageVersion = getLanguageVersion;
module.exports.getFLexCols = getFLexCols;
module.exports.getVersion = getVersion;
module.exports.extendTemplateVars = extendTemplateVars;
module.exports.nextIndex = nextIndex;
