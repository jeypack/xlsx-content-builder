/**
 * GULP ALZA RESPONSIVE CONTENT BUILDER TOOL
 * AUTHOR: J. Pfeifer (c) 2021-2022
 */
//const { bold, dim, cyan, blue, red, green, magenta, grey, white, redBright, cyanBright, greenBright, blueBright, bgMagenta } = require('ansi-colors');
//const log = require('fancy-log');
const {
  watch,
  series,
  parallel,
  src,
  dest
} = require('gulp');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const data = require("gulp-data");
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const removeLogging = require('gulp-remove-logging');
const saveLicense = require('uglify-save-license');
const autoprefixer = require('autoprefixer');
const flexbugsfixer = require('postcss-flexbugs-fixes');
const htmlReplace = require('gulp-html-replace');
const nunjucksRender = require("gulp-nunjucks-render");
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const del = require('del');
const { v4: uuidv4 } = require('uuid');
const XLSX = require("xlsx");
const zipper = require("./gulp-zipper");
const {
  XLSX_TYPE_ENUM,
  getTemplateValues,
  setTemplate,
  setTemplateValues,
} = require("./gulp-xlsx-helper.js");

const TPL_ENUM = {
  STD: "NAME",
  LANG: "LANG",
  VERSION: "VERSION",
  LANG_VERSION: "LANG_VERSION",
};

//config.DEV_FOLDER
let config = {
  UID: 0,
  DEVELOPMENT: true,
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

// HELPER FUNCTIONS GULP

const getTplNameFunction = () => {
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
    tplNames.TYPE[index]
  console.log("getZipName", "NAME:", name);
  return name
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
  if (typeof obj !== 'object') {
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
  console.log("extendTemplateVars", "obj:", obj);
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
  /* console.log(
    "nextIndex",
    "versionLength:",
    versionLength,
    "nextVersionIndex:",
    nextVersionIndex,
    "nextLanguageIndex:",
    nextLanguageIndex,
    "nextIndex:",
    nextIndex
  ); */
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
  console.log("nextIndex", "CURRENT:", config.CURRENT, "CURRENT_LANGUAGE:", config.CURRENT_LANGUAGE, "CURRENT_VERSION:", config.CURRENT_VERSION);
  return true;
};

const enableDevelopment = (cb) => {
  config.DEVELOPMENT = true;
  cb();
};

const enableProduction = (cb) => {
  config.DEVELOPMENT = false;
  cb();
};

const next = (cb) => {
  if (!nextIndex()) {
    console.log("no more next index iterations")
  }
  cb();
};

const setStartTemplate = (cb) => {
  config.CURRENT = 0;
  config.CURRENT_LANGUAGE = 0;
  config.CURRENT_VERSION = 0;
  cb();
};

const setUID = (cb) => {
  config.UID = uuidv4();
  cb();
};

// buildTemplate 1
const setDestination = (cb) => {
  const templateName = getOutputName() + "/";
  config.destination = config.DEVELOPMENT
    ? config.DEV_FOLDER + templateName
    : config.BUILD_FOLDER + templateName;
  cb();
};

// buildTemplate 2
const cleanDirectory = (cb) => {
  //del.bind(null, config.DEVELOPMENT ? [config.DEV_FOLDER + '**'] : [config.BUILD_FOLDER + '**']);
  del.sync([config.destination + '**'], {
    force: true
  });
  cb();
};

// buildTemplate 3
const moveAssets = (cb) => {
  //move from template folder to output (destination) folder
  const getTplNameFunc = getTplNameFunction();
  const templateName = getTplNameFunc() + "/";
  return src(config.SRC_PATH + templateName + "assets/**/*").pipe(
    dest(config.destination + "assets/")
  );
};

// +++ Helper +++

const createSassCss = (sources, name, destination) => {
  const output = config.DEVELOPMENT ? 'expanded' : 'compressed';
  const processors = [
    autoprefixer,
    flexbugsfixer
  ];
  return src(sources, { sourcemaps: config.DEVELOPMENT })
    //.pipe(sourcemaps.init())
    .pipe(sass.sync({
      outputStyle: output,
      precision: 10,
      includePaths: []
    }).on('error', sass.logError))
    //.pipe(sourcemaps.write('./'))
    .pipe(postcss(processors))
    .pipe(gulpif(!config.DEVELOPMENT, cssnano({ safe: true })))
    /* .pipe(cssnano({
      safe: true
    })) */
    .pipe(rename(name + '.css'))
    //.pipe(dest(destination, { sourcemaps: '.' }))
    .pipe(gulpif(!config.DEVELOPMENT, dest(destination)))
    .pipe(gulpif(config.DEVELOPMENT, dest(destination, {
      sourcemaps: '.'
    })))
    .pipe(reload({
      stream: true
    }));
};

//Helper
const createCombinedJS = (sources, name, destination, minified) => {
  //const destination = config.SRC_PATH + 'js';
  if (typeof minified !== 'boolean') {
    minified = !config.DEVELOPMENT;
  }
  return src(sources)
    .pipe(concat(name + '.js'))
    .pipe(gulpif(minified, removeLogging({
      methods: ['log', 'info']
    })))
    .pipe(gulpif(minified, uglify({
      output: {
        comments: saveLicense
      }
    })))
    //.pipe(gulpif(config.DEVELOPMENT, dest(destination)));
    .pipe(dest(destination))
    .pipe(reload({
      stream: true
    }));
};

// buildTemplate 4
const buildCss = (cb) => {
  //build from scss source out of template folder into output (destination) folder
  const getTplNameFunc = getTplNameFunction();
  const templateName = getTplNameFunc() + "/";
  const sources = [config.SRC_PATH + templateName + "index.scss"];
  const destination = config.destination + 'css';
  const name = config.DEVELOPMENT ? 'index.min' : 'index.' + config.UID + '.min';
  return createSassCss(sources, name, destination);
};

// buildTemplate 5
const buildJs = (cb) => {
  let sources = [config.SRC_PATH + 'js/flex-slider.js'];
  if (config.DEVELOPMENT) {
    sources.push(config.SRC_PATH + 'js/index.js');
  }
  const destination = config.destination + 'js';
  const name = config.DEVELOPMENT ? 'index.min' : 'index.' + config.UID + '.min';
  return createCombinedJS(sources, name, destination, !config.DEVELOPMENT);
};

const buildHtml = (cb) => {
  const getTplNameFunc = getTplNameFunction();
  const templateName = getTplNameFunc() + "/";
  const name = config.DEVELOPMENT ? 'index.min' : 'index.' + config.UID + '.min';
  return src(config.SRC_PATH + templateName + "index.html")
    .pipe(
      htmlReplace({
        css: "./css/" + name + ".css",
        js: "./js/" + name + ".js",
      })
    )
    .pipe(rename("index.html"))
    .pipe(dest(config.destination))
    .pipe(
      reload({
        stream: true,
      })
    );
};

const buildNunjucks = () => {
  // Gets .html and .nunjucks files in pages
  //return src(adBundler.SRC + 'pages/**/*.+(html|njk|nunjucks)')
  //get nunjucks pages via name (.njk)
  const pageName = getTplName();
  console.log("buildNunjucks", "pageName:", pageName);
  const name = config.DEVELOPMENT ? 'index.min' : 'index.' + config.UID + '.min';
  return (
    src(config.SRC_PATH + "pages/" + pageName + ".njk")
      .pipe(
        data(function (file) {
          //log('nunjucks data obj: ' + JSON.stringify(obj));
          //console.log("buildNunjucks data path: " + file.path);
          const xlsxName = getXLSXName();
          console.log("buildNunjucks data xlsxName: " + xlsxName);
          const filename = config.SRC_PATH + "xlsx/" + xlsxName + ".xlsx";
          const workbook = XLSX.read(filename, { type: "file" });
          console.log("buildNunjucks data filename:", filename);
          //console.log("buildNunjucks data workbook:", workbook);
          const xlsxParser = geXlsxParser();
          console.log("buildNunjucks data xlsxParser:", xlsxParser);
          // try to get the sheet named 'Template' FROM workbook HERE
          try {
            setTemplate(workbook.Sheets.Template);
            setTemplateValues(xlsxParser);
            let tplValues = getTemplateValues();
            extendTemplateVars(tplValues);
            //console.log("handleFileAsync tplValues:", tplValues);
            return tplValues;
          } catch (error) {
            console.log("buildNunjucks data catch error:", error);
          }
          return extendTemplateVars();
          //return cb(undefined, tplValues);
        })
      )
      // Renders template with nunjucks
      .pipe(
        nunjucksRender({
          path: [config.SRC_PATH + "templates"],
        })
      )
      // output files (index.html) in app folder
      .pipe(rename("index.html"))
      .pipe(dest(config.destination))
      .pipe(
        reload({
          stream: true,
        })
      )
  );
};

const reloadBrowser = (cb) => {
  reload();
  cb();
};

// Watch Files For Changes
const watchDirectory = (cb) => {
  // proxy for MAMP htdocs
  /*browserSync.init({
  	proxy: "http://localhost/banner/bankcler/index-dev.php"
  });*/
  browserSync.init({
    // Open the site in Chrome & Firefox
    //browser: ["google chrome", "firefox"],
    // Wait for 0.15 seconds before any browsers should try to inject/reload a file.
    reloadDelay: 150,
    // Don't show any notifications in the browser.
    notify: false,
    port: 9000,
    //server: "temp"
    server: {
      //directory: true,
      index: "index.html",
      baseDir: config.destination,
    },
  });
  /* function handleChange(event) {
  	console.log('File ' + event.path + ' was changed');
  	reload();
  } */
  //build from scss source out of template folder into output (destination) folder
  const getTplNameFunc = getTplNameFunction();
  const templateName = getTplNameFunc() + "/";
  //watch("./build/**/*.html").on("change", handleChange);
  //watch([config.SRC_PATH + 'js/*.js', '!' + config.SRC_PATH + 'js/*.min.js'], buildHtml);
  //watch(config.SRC_PATH + 'vendor/*.js', series(buildVendorJs));
  watch(config.SRC_PATH + templateName + "assets/**/*", buildTemplate);
  watch(config.SRC_PATH + "js/*.js", buildJs);
  watch(config.SRC_PATH + "scss/*.scss", buildCss);
  watch(config.SRC_PATH + templateName + "/*.scss", buildCss);
  watch(config.SRC_PATH + templateName + "/index.html", buildHtml);
  watch(config.SRC_PATH + "pages/**/*.+(html|njk|nunjucks)", buildNunjucks);
  watch(config.SRC_PATH + "templates/**/*.+(html|njk|nunjucks)", buildNunjucks);
  cb();
};

const zip = (cb) => {
  const folder = config.DEVELOPMENT ? config.DEV_FOLDER : config.BUILD_FOLDER;
  const name = getZipName();
  // leave fallbacks folder by default: "!" + folder + "fallbacks"
  // get only folders inside directory without single files and zip folder
  return src([folder + "*", "!" + folder + "zip", "!" + folder + "*.*"])
    .pipe(
      zipper(
        { destination: folder + "zip/", name: name },
        function (evt) {
          console.log(
            "zip :",
            evt.file,
            "destination:",
            evt.destination,
            "isDirectory:",
            evt.isDirectory,
            "index:",
            evt.index,
            "message:",
            evt.message
          );
        }
      )
    );
  };

const buildTemplate = series(
  setDestination,
  cleanDirectory,
  moveAssets,
  parallel(buildCss, buildJs),
  buildNunjucks
);

const buildTemplateViaHtml = series(
  setDestination,
  cleanDirectory,
  moveAssets,
  parallel(buildCss, buildJs),
  buildHtml
);

exports.default = series(
  enableDevelopment,
  setUID,
  buildTemplate,
  watchDirectory,
  reloadBrowser
);

exports.html = series(
  enableDevelopment,
  setUID,
  buildTemplateViaHtml,
  watchDirectory,
  reloadBrowser
);

exports.dev = series(
  enableDevelopment,
  setUID,
  setStartTemplate,
  //repeat this until end of templates
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  /* next,
  buildTemplate */
);

exports.build = series(
  enableProduction,
  setUID,
  setStartTemplate,
  //repeat this until end of templates
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  /* next,
  buildTemplate */
);

exports.clean = series(setDestination, enableDevelopment, cleanDirectory, enableProduction, cleanDirectory);

exports.zip = series(enableDevelopment, zip, enableProduction, zip);

//+++ R.I.P. +++
//npm init react-app ./my-react-app

//SRC_VANILLA: ['Clipboard.js', 'EventDispatcher.js', 'Point.js', 'Rectangle.js', 'Vector2D.js', 'PointerEvents.js'],
/* const buildVendorJs = (cb) => {
  const sources = [config.SRC_VENDOR + 'gsap.min.js'];
  const destination = config.DEVELOPMENT ? config.DEV_FOLDER + 'js' : config.BUILD_FOLDER + 'js';
  return createCombinedJS(sources, 'vendor.min', destination, false);
}; */

//ACTIVATE THIS FOR INLINE BUILD
/* const buildHtmlInline = (cb) => {
  const sourcesScss = [config.SRC_PATH + 'scss/index.scss'];
  const sourcesVendor = [config.SRC_VENDOR + 'gsap.min.js'];
  //, ...config.SRC_VANILLA.map(elem => config.SRC_PATH + 'js/' + elem)
  const sources = [config.SRC_PATH + 'js/index.js'];
  const destinationCss = config.DEVELOPMENT ? config.DEV_FOLDER + 'css' : config.BUILD_FOLDER + 'css';
  const destinationJs = config.DEVELOPMENT ? config.DEV_FOLDER + 'js' : config.BUILD_FOLDER + 'js';
  return src(config.SRC_PATH + 'index.html')
    .pipe(htmlReplace({
      css: {
        src: createSassCss(sourcesScss, 'index.min', destinationCss),
        tpl: '<style>%s</style>'
      },
      jsVendor: {
        src: createCombinedJS(sourcesVendor, 'vendor.min', destinationJs, false),
        tpl: '<script>%s</script>'
      },
      js: {
        src: createCombinedJS(sources, 'index.min', destinationJs, !config.DEVELOPMENT),
        tpl: '<script>%s</script>'
      }
    }))
    .pipe(rename('index.html'))
    .pipe(dest(config.DEVELOPMENT ? config.DEV_FOLDER : config.BUILD_FOLDER));
}; */
