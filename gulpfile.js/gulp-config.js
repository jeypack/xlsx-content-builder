const fs = require("fs");
const { TPL_NAMES } = require("./config/OralB-Genesis5");
//const { TPL_NAMES } = require("./config/P8-STD");
//const { TPL_NAMES } = require("./config/MOJITO-BABYDRY");
//const { TPL_NAMES } = require("./config/P-MATISSE-BABYDRY");
//const { TPL_NAMES } = require("./config/P-PANDORA");
//const { TPL_NAMES } = require("./config/P-PAW-PATROL");

const TPL_ENUM = {
  STD: "NAME",
  LANG: "LANG",
  VERSION: "VERSION",
  LANG_VERSION: "LANG_VERSION",
};

const SRC_PATH = "./src/xlsx-template/";
//here we break for 'PRODUCT', that could be more than one…
//TODO: get 'TEMPLATE_FOLDER' and 'TEMPLATE_SRC' via functions
const BRAND = TPL_NAMES.BRAND[0];
const PRODUCT = TPL_NAMES.PRODUCT[0];
const config = {
  UID: 0,
  DEVELOPMENT: true,
  HAS_FOLDER_TO_ZIP: false,
  HAS_NUNJUCK_TPL: false,
  //PATH_INCLUDES_SASS: ['bower_components/juiced/sass/'],
  HTDOCS_PATH: "/Applications/MAMP/htdocs/",
  SRC_PATH: SRC_PATH,
  SRC_PATH_BUILD_IGNORES: [
    "!" + SRC_PATH + "**/_images/**",
    "!" + SRC_PATH + "**/pages/**",
    "!" + SRC_PATH + "**/scss/**",
    "!" + SRC_PATH + "**/js/**",
    "!" + SRC_PATH + "**/xlsx/**",
    "!" + SRC_PATH + "**/templates/**",
  ],
  SRC_VENDOR: "./src/vendor/",
  DEV_FOLDER: "./_temp/",
  TEST_FOLDER: "./_test/",
  BUILD_FOLDER: "./_build/",
  TEMPLATE_SRC: SRC_PATH + BRAND + "_" + PRODUCT,
  OUTPUT_FOLDERS: [],
  // PREFIX_BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_SIZE_CLIENT_VERSION_DATE
  //e.g. HTML5_OralB_Genesis5_KIDS-Lightyear_HU_V1_1195xAUTO_V01_220626
  TPL_NAMES: TPL_NAMES,
  // !!! SET TO YOUR NEEDS !!!
  JPEG_QUALITY: 82,
  EXPORT_LENGTH: 4, //unused
  //change this for development testing
  CURRENT: 0, // TYPE
  CURRENT_LANGUAGE: 0,
  CURRENT_SUJET: 0,
  CURRENT_TPL_VERSION: "LANG", //@see getTplNameFunction
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

//e.g.: Pampers_P8-Std_Size-0-2_CZ_1_220324
const getOutputNameByTemplate = (name) => {
  //console.log("getOutputNameByTemplate", "name:", name);
  //look over TPL_NAMES {object}
  let current = 0;
  let currentLanguage = 0;
  const parts = name.split("_");
  const type = parts[2];
  let language = parts.slice(-3)[0];
  //fallback if…
  //…we got name without version/sujet
  if (parts.length === 5) {
    //e.g.: Pampers_P8-Std_Size-0-2_SK_220324
    language = parts.slice(-2)[0];
  }
  //BRAND PRODUCT TYPE LANGUAGE VERSION CLIENT_VERSION DATE 
  for (let i = 0, l = TPL_NAMES.TYPE.length; i < l; i++) {
    if (TPL_NAMES.TYPE[i] === type) {
      current = i;
      break;
    }
  }
  //search inside 2 dimensional lang array
  for (let i = 0, l = TPL_NAMES.LANGUAGE[current].length; i < l; i++) {
    if (TPL_NAMES.LANGUAGE[current][i] === language) {
      currentLanguage = i;
      break;
    }
  }
  return getOutputName(current, currentLanguage);
};

const getTplNameFunction = () => {
  //console.log("getTplNameFunction", "CURRENT_TPL_VERSION:", config.CURRENT_TPL_VERSION);
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
// BRAND_PRODUCT
const getTplFolder = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const name = tplNames.BRAND[index] + "_" + tplNames.PRODUCT[index];
  //console.log("getTplFolder", "NAME:", name);
  return name;
};
const getStandardLayout = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const layout = "StandardFlexLayout";
  return tplNames.STANDARD_LAYOUT ? tplNames.STANDARD_LAYOUT[index] : layout;
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
  //console.log("getTplName", "NAME:", name);
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
  //console.log("getTplLangName", "NAME:", name);
  return name;
};
// BRAND_PRODUCT_TYPE_VERSION_DATE
const getTplVersionName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const sujetIndex = config.CURRENT_SUJET;
  const name =
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index] +
    "_" +
    (sujetIndex + 1) +
    "_" +
    tplNames.DATE[index];
  //console.log("getTplVersionName", "NAME:", name);
  return name;
};
// BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_DATE
const getTplLangVersionName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const sujetIndex = config.CURRENT_SUJET;
  const name =
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index] +
    "_" +
    tplNames.LANGUAGE[index][languageIndex] +
    "_" +
    (sujetIndex + 1) +
    "_" +
    tplNames.DATE[index];
  console.log("getTplLangVersionName", "NAME:", name);
  return name;
};
//BRAND_PRODUCT_TYPE
const getZipName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const name =
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index];
  //console.log("getZipName", "NAME:", name);
  return name;
};
//BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_DATE
const getXLSXName = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const sujetIndex = config.CURRENT_SUJET;
  const name =
    tplNames.BRAND[index] +
    "_" +
    tplNames.PRODUCT[index] +
    "_" +
    tplNames.TYPE[index] +
    "_" +
    tplNames.LANGUAGE[index][languageIndex] +
    "_" +
    (sujetIndex + 1) +
    "_" +
    tplNames.DATE[index];
  //console.log("getXLSXName", "NAME:", name);
  return name;
};
//PREFIX_BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_SIZE_CLIENT_VERSION_DATE
// 3 overloads
const getOutputName = (index, languageIndex, sujetIndex) => {
  //_web_2023_03
  //config.DEVELOPMENT
  //tplNames.SUFFIX
  const tplNames = config.TPL_NAMES;
  index = typeof index === 'number' ? index : config.CURRENT;
  languageIndex = typeof languageIndex === 'number' ? languageIndex : config.CURRENT_LANGUAGE;
  sujetIndex = typeof sujetIndex === 'number' ? sujetIndex : config.CURRENT_SUJET;
  let name = "";
  if (config.DEVELOPMENT) {
    name =
      tplNames.BRAND[index] +
      "_" +
      tplNames.PREFIX +
      "_" +
      tplNames.SUFFIX +
      "_" +
      tplNames.PRODUCT[index] +
      "_" +
      tplNames.TYPE[index] +
      "_" +
      tplNames.LANGUAGE[index][languageIndex] +
      /* "_" +
      (sujetIndex + 1) + */
      "_" +
      tplNames.SIZE +
      tplNames.CLIENT_VERSION[index] +
      "_" +
      tplNames.DATE[index];
  } else {
    name =
      tplNames.BRAND[index] +
      "_" +
      tplNames.PREFIX +
      "_" +
      tplNames.PRODUCT[index] +
      "_" +
      tplNames.TYPE[index] +
      "_" +
      tplNames.LANGUAGE[index][languageIndex] +
      /* "_" +
      (sujetIndex + 1) + */
      "_" +
      tplNames.SIZE +
      tplNames.CLIENT_VERSION[index] +
      "_" +
      tplNames.DATE[index];
  }
  //console.log("getOutputName", "NAME:", name);
  return name;
};
//TYPE
const getType = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  return tplNames.TYPE[index];
};
//DATE
const getDate = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  return tplNames.DATE[index];
};
const getLanguage = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  console.log(
    "gulp-config getLanguage",
    "index:",
    index,
    "languageIndex:",
    languageIndex
  );
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
  return tplNames.XLSX_PARSER ? tplNames.XLSX_PARSER[index] : "";
};
const getLanguageVersion = () => {
  return config.CURRENT_SUJET + 1;
};
const getFLexCols = () => {
  const tplNames = config.TPL_NAMES;
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  return tplNames.FLEX_COLS[index][languageIndex];
};
const getVersion = () => {
  return "STD TPL V2.2.0 | 17.03.2023 | " + new Date().toDateString();
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
  //obj.flexSliderCols = getFLexCols();
  //console.log("extendTemplateVars", "obj:", obj);
  return obj;
};
/**
 * Gulp nex index iterator
 */
const nextIndex = () => {
  const tpls = config.TPL_NAMES;
  //HERE WE GET LENGTH VOR CALCULATIONS
  const length = tpls.BRAND.length;
  const languageLength = tpls.LANGUAGE[config.CURRENT].length;
  const versionLength = tpls.VERSION[config.CURRENT][config.CURRENT_LANGUAGE];
  const nextIndex = config.CURRENT + 1;
  const nextLanguageIndex = config.CURRENT_LANGUAGE + 1;
  const nextVersionIndex = config.CURRENT_SUJET + 1;
  if (nextVersionIndex < versionLength) {
    config.CURRENT_SUJET = nextVersionIndex;
  } else {
    config.CURRENT_SUJET = 0;
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
  printIndex();
  return true;
};
const printIndex = () => {
  console.log(
    "nextIndex",
    "CURRENT:",
    config.CURRENT,
    "CURRENT_LANGUAGE:",
    config.CURRENT_LANGUAGE,
    "CURRENT_SUJET:",
    config.CURRENT_SUJET
  );
};
const resetIndex = () => {
  config.CURRENT = 0;
  config.CURRENT_LANGUAGE = 0;
  config.CURRENT_SUJET = 0;
  printIndex();
};

// config, directoryContains, getTplNameFunction, getTplName, getTplLangName, getTplVersionName, getTplLangVersionName, getZipName, getXLSXName, getOutputName, getLanguage, geBodyClass, geXlsxParser, getLanguageVersion, getFLexCols, getVersion, extendTemplateVars, nextIndex
module.exports.config = config;
module.exports.TPL_ENUM = TPL_ENUM;
//module.exports.templateBuild = templateBuild;
module.exports.directoryContains = directoryContains;
module.exports.getTplNameFunction = getTplNameFunction;
module.exports.getTplFolder = getTplFolder;
module.exports.getTplName = getTplName;
module.exports.getTplLangName = getTplLangName;
module.exports.getTplVersionName = getTplVersionName;
module.exports.getTplLangVersionName = getTplLangVersionName;
module.exports.getZipName = getZipName;
module.exports.getXLSXName = getXLSXName;
module.exports.getOutputName = getOutputName;
module.exports.getOutputNameByTemplate = getOutputNameByTemplate;
module.exports.getType = getType;
module.exports.getDate = getDate;
module.exports.getLanguage = getLanguage;
module.exports.geBodyClass = geBodyClass;
module.exports.geXlsxParser = geXlsxParser;
module.exports.getLanguageVersion = getLanguageVersion;
module.exports.getFLexCols = getFLexCols;
module.exports.getVersion = getVersion;
module.exports.extendTemplateVars = extendTemplateVars;
module.exports.nextIndex = nextIndex;
module.exports.resetIndex = resetIndex;
module.exports.printIndex = printIndex;
module.exports.getStandardLayout = getStandardLayout;
