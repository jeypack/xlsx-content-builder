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
  CURRENT: 2, // TYPE
  CURRENT_LANGUAGE: 2,
  CURRENT_SUJET: 0,
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
  console.log(
    "getTplNameFunction",
    "CURRENT_TPL_VERSION:",
    TPL_NAMES.CURRENT_TPL_VERSION
  );
  switch (TPL_NAMES.CURRENT_TPL_VERSION) {
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
// BRAND/PRODUCT
const getTplFolder = () => {
  const index = config.CURRENT;
  const name = TPL_NAMES.BRAND[index] + "/" + TPL_NAMES.PRODUCT[index];
  //console.log("getTplFolder", "NAME:", name);
  return name;
};
const getStandardLayout = () => {
  const index = config.CURRENT;
  const layout = "StandardFlexLayout";
  return TPL_NAMES.STANDARD_LAYOUT ? TPL_NAMES.STANDARD_LAYOUT[index] : layout;
};
// BRAND_PRODUCT_TYPE_DATE (same images and scss)
const getTplName = () => {
  const index = config.CURRENT;
  const name =
    TPL_NAMES.BRAND[index] +
    "_" +
    TPL_NAMES.PRODUCT[index] +
    "_" +
    TPL_NAMES.TYPE[index] +
    "_" +
    TPL_NAMES.DATE[index];
  //console.log("getTplName", "NAME:", name);
  return name;
};
// BRAND_PRODUCT_TYPE_LANGUAGE_DATE
const getTplLangName = () => {
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const name =
    TPL_NAMES.BRAND[index] +
    "_" +
    TPL_NAMES.PRODUCT[index] +
    "_" +
    TPL_NAMES.TYPE[index] +
    "_" +
    TPL_NAMES.LANGUAGE[index][languageIndex] +
    "_" +
    TPL_NAMES.DATE[index];
  //console.log("getTplLangName", "NAME:", name);
  return name;
};
// BRAND_PRODUCT_TYPE_VERSION_DATE
const getTplVersionName = () => {
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const sujetIndex = config.CURRENT_SUJET;
  const name =
    TPL_NAMES.BRAND[index] +
    "_" +
    TPL_NAMES.PRODUCT[index] +
    "_" +
    TPL_NAMES.TYPE[index] +
    "_" +
    TPL_NAMES.SUJET[index][languageIndex][sujetIndex] +
    "_" +
    TPL_NAMES.DATE[index];
  //console.log("getTplVersionName", "NAME:", name);
  return name;
};
// BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_DATE
const getTplLangVersionName = () => {
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const sujetIndex = config.CURRENT_SUJET;
  const name =
    TPL_NAMES.BRAND[index] +
    "_" +
    TPL_NAMES.PRODUCT[index] +
    "_" +
    TPL_NAMES.TYPE[index] +
    "_" +
    TPL_NAMES.SUJET[index][languageIndex][sujetIndex] +
    "_" +
    TPL_NAMES.LANGUAGE[index][languageIndex] +
    "_" +
    TPL_NAMES.DATE[index];
  console.log("getTplLangVersionName", "NAME:", name);
  return name;
};
//BRAND_PRODUCT_TYPE
const getZipName = () => {
  const index = config.CURRENT;
  const name =
    TPL_NAMES.BRAND[index] +
    "_" +
    TPL_NAMES.PRODUCT[index] +
    "_" +
    TPL_NAMES.TYPE[index];
  //console.log("getZipName", "NAME:", name);
  return name;
};
//BRAND_PRODUCT_TYPE_VERSION_LANGUAGE_DATE
const getXLSXName = () => {
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  const sujetIndex = config.CURRENT_SUJET;
  const name =
    TPL_NAMES.BRAND[index] +
    "_" +
    TPL_NAMES.PRODUCT[index] +
    "_" +
    TPL_NAMES.TYPE[index] +
    "_" +
    TPL_NAMES.SUJET[index][languageIndex][sujetIndex] +
    "_" +
    TPL_NAMES.LANGUAGE[index][languageIndex] +
    "_" +
    TPL_NAMES.DATE[index];
  console.log("getXLSXName", "NAME:", name);
  return name;
};
//PREFIX_BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_SIZE_CLIENT_VERSION_DATE
// 3 overloads
const getOutputName = (index, languageIndex, sujetIndex) => {
  //_web_2023_03
  index = typeof index === "number" ? index : config.CURRENT;
  languageIndex =
    typeof languageIndex === "number" ? languageIndex : config.CURRENT_LANGUAGE;
  sujetIndex =
    typeof sujetIndex === "number" ? sujetIndex : config.CURRENT_SUJET;
  let name = "";
  if (config.DEVELOPMENT) {
    name =
      TPL_NAMES.BRAND[index] +
      "_" +
      TPL_NAMES.PREFIX +
      "_" +
      TPL_NAMES.SUFFIX +
      "_" +
      TPL_NAMES.PRODUCT[index] +
      "_" +
      TPL_NAMES.TYPE[index] +
      "_" +
      TPL_NAMES.SUJET[index][languageIndex][sujetIndex] +
      "_" +
      TPL_NAMES.LANGUAGE[index][languageIndex] +
      "_" +
      TPL_NAMES.SIZE +
      TPL_NAMES.CLIENT_VERSION[index] +
      "_" +
      TPL_NAMES.DATE[index];
  } else {
    name =
      TPL_NAMES.BRAND[index] +
      "_" +
      TPL_NAMES.PREFIX +
      "_" +
      TPL_NAMES.PRODUCT[index] +
      "_" +
      TPL_NAMES.TYPE[index] +
      "_" +
      TPL_NAMES.SUJET[index][languageIndex][sujetIndex] +
      "_" +
      TPL_NAMES.LANGUAGE[index][languageIndex] +
      "_" +
      TPL_NAMES.SIZE +
      TPL_NAMES.CLIENT_VERSION[index] +
      "_" +
      TPL_NAMES.DATE[index];
  }
  //console.log("getOutputName", "NAME:", name);
  return name;
};
//TYPE
const getType = () => {
  const index = config.CURRENT;
  return TPL_NAMES.TYPE[index];
};
//DATE
const getDate = () => {
  const index = config.CURRENT;
  return TPL_NAMES.DATE[index];
};
const getLanguage = () => {
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  console.log(
    "gulp-config getLanguage",
    "index:",
    index,
    "languageIndex:",
    languageIndex
  );
  return TPL_NAMES.LANGUAGE[index][languageIndex];
};
const geBodyClass = () => {
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  return TPL_NAMES.BODY_CLASS[index][languageIndex];
};
const geXlsxParser = () => {
  const index = config.CURRENT;
  return TPL_NAMES.XLSX_PARSER ? TPL_NAMES.XLSX_PARSER[index] : "";
};
const getLanguageVersion = () => {
  return config.CURRENT_SUJET + 1;
};
/* const getFLexCols = () => {
  const index = config.CURRENT;
  const languageIndex = config.CURRENT_LANGUAGE;
  return TPL_NAMES.FLEX_COLS[index][languageIndex];
}; */
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
  //console.log("extendTemplateVars", "obj:", obj);
  return obj;
};
/**
 * Gulp nex index iterator
 */
const nextIndex = () => {
  //HERE WE GET LENGTH VOR CALCULATIONS
  const length = TPL_NAMES.BRAND.length;
  const languageLength = TPL_NAMES.LANGUAGE[config.CURRENT].length;
  const versionLength =
    TPL_NAMES.VERSION[config.CURRENT][config.CURRENT_LANGUAGE];
  const nextIndex = config.CURRENT + 1;
  const nextLanguageIndex = config.CURRENT_LANGUAGE + 1;
  const nextSujetIndex = config.CURRENT_SUJET + 1;
  if (nextSujetIndex < versionLength) {
    config.CURRENT_SUJET = nextSujetIndex;
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

// config, directoryContains, getTplNameFunction, getTplName, getTplLangName, getTplVersionName, getTplLangVersionName, getZipName, getXLSXName, getOutputName, getLanguage, geBodyClass, geXlsxParser, getLanguageVersion, getVersion, extendTemplateVars, nextIndex
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
module.exports.getVersion = getVersion;
module.exports.extendTemplateVars = extendTemplateVars;
module.exports.nextIndex = nextIndex;
module.exports.resetIndex = resetIndex;
module.exports.printIndex = printIndex;
module.exports.getStandardLayout = getStandardLayout;
