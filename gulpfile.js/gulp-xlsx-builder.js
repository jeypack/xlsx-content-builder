/**
 * GULP ALZA RESPONSIVE CONTENT BUILDER TOOL
 * AUTHOR: J. Pfeifer (c) 2021-2022
 */
//const { bold, dim, cyan, blue, red, green, magenta, grey, white, redBright, cyanBright, greenBright, blueBright, bgMagenta } = require('ansi-colors');
//const log = require('fancy-log');
const fs = require("fs");
const { watch, series, parallel, src, dest } = require("gulp");
const gulpif = require("gulp-if");
const concat = require("gulp-concat");
const data = require("gulp-data");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const removeLogging = require("gulp-remove-logging");
const saveLicense = require("uglify-save-license");
const autoprefixer = require("autoprefixer");
const flexbugsfixer = require("postcss-flexbugs-fixes");
const htmlReplace = require("gulp-html-replace");
const nunjucksRender = require("gulp-nunjucks-render");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const del = require("del");
const { v4: uuidv4 } = require("uuid");
const XLSX = require("xlsx");
const zipper = require("./gulp-zipper");

const {
  config,
  directoryContains,
  getTplNameFunction,
  getTplName,
  getZipName,
  getXLSXName,
  getOutputName,
  geXlsxParser,
  extendTemplateVars,
  nextIndex,
} = require("./gulp-config.js");

const { XLSX_TYPE_ENUM } = require("./parser/XLSXParserEnum");
const { XLSXParserFactory } = require("./parser/XLSXParserFactory");

// GULP ENABLED

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
    console.log("no more next index iterations");
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
  del.sync([config.destination + "**"], {
    force: true,
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
  const output = config.DEVELOPMENT ? "expanded" : "compressed";
  const processors = [autoprefixer, flexbugsfixer];
  return (
    src(sources, { sourcemaps: config.DEVELOPMENT })
      //.pipe(sourcemaps.init())
      .pipe(
        sass
          .sync({
            outputStyle: output,
            precision: 10,
            includePaths: [],
          })
          .on("error", sass.logError)
      )
      //.pipe(sourcemaps.write('./'))
      .pipe(postcss(processors))
      .pipe(gulpif(!config.DEVELOPMENT, cssnano({ safe: true })))
      /* .pipe(cssnano({
      safe: true
    })) */
      .pipe(rename(name + ".css"))
      //.pipe(dest(destination, { sourcemaps: '.' }))
      .pipe(gulpif(!config.DEVELOPMENT, dest(destination)))
      .pipe(
        gulpif(
          config.DEVELOPMENT,
          dest(destination, {
            sourcemaps: ".",
          })
        )
      )
      .pipe(
        reload({
          stream: true,
        })
      )
  );
};

//Helper
const createCombinedJS = (sources, name, destination, minified) => {
  //const destination = config.SRC_PATH + 'js';
  if (typeof minified !== "boolean") {
    minified = !config.DEVELOPMENT;
  }
  return (
    src(sources)
      .pipe(concat(name + ".js"))
      .pipe(
        gulpif(
          minified,
          removeLogging({
            methods: ["log", "info"],
          })
        )
      )
      .pipe(
        gulpif(
          minified,
          uglify({
            output: {
              comments: saveLicense,
            },
          })
        )
      )
      //.pipe(gulpif(config.DEVELOPMENT, dest(destination)));
      .pipe(dest(destination))
      .pipe(
        reload({
          stream: true,
        })
      )
  );
};

// buildTemplate 4
const buildCss = (cb) => {
  //build from scss source out of template folder into output (destination) folder
  const getTplNameFunc = getTplNameFunction();
  const templateName = getTplNameFunc() + "/";
  const sources = [config.SRC_PATH + templateName + "index.scss"];
  const destination = config.destination + "css";
  const name = config.DEVELOPMENT
    ? "index.min"
    : "index." + config.UID + ".min";
  return createSassCss(sources, name, destination);
};

// buildTemplate 5
const buildJs = (cb) => {
  let sources = [config.SRC_PATH + "js/flex-slider.js"];
  if (config.DEVELOPMENT) {
    sources.push(config.SRC_PATH + "js/index.js");
  }
  const destination = config.destination + "js";
  const name = config.DEVELOPMENT
    ? "index.min"
    : "index." + config.UID + ".min";
  return createCombinedJS(sources, name, destination, !config.DEVELOPMENT);
};

const buildHtml = (cb) => {
  const getTplNameFunc = getTplNameFunction();
  const templateName = getTplNameFunc() + "/";
  const name = config.DEVELOPMENT
    ? "index.min"
    : "index." + config.UID + ".min";
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
  //get nunjucks pages via name (.njk)
  const pageName = getTplName();
  // BRAND_PRODUCT_TYPE_DATE
  console.log("buildNunjucks", "pageName:", pageName);
  return (
    src(config.SRC_PATH + "pages/" + pageName + ".njk")
      .pipe(
        data(function (file) {
          //console.log("buildNunjucks data path: " + file.path);
          //BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_DATE
          const xlsxName = getXLSXName();
          console.log("buildNunjucks data xlsxName: " + xlsxName);
          const xlsxParser = geXlsxParser();
          console.log("buildNunjucks data xlsxParser:", xlsxParser);
          const filename = config.SRC_PATH + "xlsx/" + xlsxName + ".xlsx";
          console.log("buildNunjucks data filename:", filename);
          // try to get the sheet named 'Template' FROM workbook HERE
          try {
            const workbook = XLSX.read(filename, { type: "file" });
            //console.log("buildNunjucks data workbook:", workbook);
            //Call simple factory method
            let tplValues = XLSXParserFactory.create(
              xlsxParser,
              workbook.Sheets.Template
            );
            extendTemplateVars(tplValues);
            console.log("handleFileAsync tplValues:", tplValues);
            //console.log("handleFileAsync tplValues.module2:", tplValues.module2);
            //console.log("handleFileAsync tplValues.module3:", tplValues.module3);
            return tplValues;
          } catch (error) {
            console.log("*");
            console.log("buildNunjucks data catch error:", error);
            console.log("*");
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

const setConfigHasFolderToZip = (cb) => {
  const folder = config.DEVELOPMENT ? config.DEV_FOLDER : config.BUILD_FOLDER;
  directoryContains(
    folder,
    (resp) => {
      const length = resp.files.length;
      /* for (let i = 0; i < length; i++) {
      console.log("zip", "i:", i, "files:", resp.files[i]);
    } */
      config.HAS_FOLDER_TO_ZIP = length > 1;
      console.log(
        "zip",
        "folder:",
        folder,
        "config.HAS_FOLDER_TO_ZIP:",
        config.HAS_FOLDER_TO_ZIP
      );
      cb();
    },
    (error) => {
      config.HAS_FOLDER_TO_ZIP = false;
      console.log(
        "zip",
        "folder:",
        folder,
        "error:",
        error.substr(0, 20),
        "..."
      );
      cb();
    }
  );
};

const zip = (cb) => {
  const folder = config.DEVELOPMENT ? config.DEV_FOLDER : config.BUILD_FOLDER;
  const name = getZipName();
  console.log("zip", "folder:", folder);
  const stream = src([
    folder + "*",
    "!" + folder + "zip",
    "!" + folder + "*.*",
  ]).pipe(
    zipper({ destination: folder + "zip/", name: name }, (evt) => {
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
    })
  );
  if (config.HAS_FOLDER_TO_ZIP) {
    // leave fallbacks folder by default: "!" + folder + "fallbacks"
    // get only folders inside directory without single files and zip folder
    return stream;
  }
  cb();
};

// HELPERS

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

// EXPORTS

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
  buildTemplate, */
  setConfigHasFolderToZip,
  zip
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
  buildTemplate, */
  setConfigHasFolderToZip,
  zip
);

exports.clean = series(
  enableDevelopment,
  setDestination,
  cleanDirectory,
  enableProduction,
  setDestination,
  cleanDirectory
);

exports.zip = series(
  enableDevelopment,
  setConfigHasFolderToZip,
  zip,
  enableProduction,
  setConfigHasFolderToZip,
  zip
);

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
