/**
 * GULP XLSX RESPONSIVE CONTENT BUILDER TOOL
 * AUTHOR: J. Pfeifer (c) 2021-2023
 */
const { col, timeprint } = require("./console-col");
//const fs = require("fs");
const { watch, series, parallel, src, dest } = require("gulp");
const imagemin = require("gulp-imagemin");
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
//const mergeStream = require("merge-stream");
const merge2 = require("merge2");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const del = require("del");
const { v4: uuidv4 } = require("uuid");
const XLSX = require("xlsx");
const zipper = require("./gulp-zipper");
//inline plugin
//const through2 = require("through2");
const {
  config,
  directoryContains,
  getTplNameFunction,
  getTplFolder,
  getTplName,
  getZipName,
  getXLSXName,
  getOutputName,
  getOutputNameByTemplate,
  geXlsxParser,
  extendTemplateVars,
  nextIndex,
  resetIndex,
  //printIndex,
  getVersion,
  getDate,
  getType,
  getLanguage,
  getStandardLayout,
} = require("./gulp-config.js");

const { XLSX_TYPE_ENUM } = require("./parser/XLSXParserEnum");
const { XLSXParserFactory } = require("./parser/XLSXParserFactory");
const { obj } = require("through2");

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

const setConfigHasNunjuckTpl = (cb) => {
  const pageName = getTplName();
  const tplFile = config.SRC_PATH + "pages/" + pageName + ".njk";
  directoryContains(
    tplFile,
    (resp) => {
      const length = resp.files.length;
      /* for (let i = 0; i < length; i++) {
        console.log("zip", "i:", i, "files:", resp.files[i]);
      } */
      config.HAS_NUNJUCK_TPL = length > 1;
      console.log(timeprint(), "HAS_NUNJUCK_TPL:", config.HAS_NUNJUCK_TPL);
      console.log(timeprint(), "tplFile:", tplFile);
      cb();
    },
    (err) => {
      config.HAS_NUNJUCK_TPL = false;
      console.log(
        timeprint(true),
        col.fg.yellow + "NO SUCH TEMPLATE:",
        col.reset + col.dim + tplFile + col.reset,
        col.fg.yellow + "USING -> StandardFlexLayout.njk"
      );
      cb();
    }
  );
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
  const destination = config.DEVELOPMENT
    ? config.destination + "**/"
    : config.BUILD_FOLDER + "**/";
  //console.log("cleanDirectory", "destination:", destination);
  del.sync([destination]);
  cb();
};

const cleanZipFolder = (cb) => {
  //del.bind(null, config.DEVELOPMENT ? [config.DEV_FOLDER + '**'] : [config.BUILD_FOLDER + '**']);
  del.sync([config.DEV_FOLDER + "zip", config.BUILD_FOLDER + "zip"], {
    force: true,
  });
  cb();
};

const cleanBuild = (cb) => {
  del.sync([config.BUILD_FOLDER + "**"], {
    force: true,
  });
  cb();
};

const cleanAll = (cb) => {
  del.sync([config.DEV_FOLDER + "**", config.BUILD_FOLDER + "**"], {
    force: true,
  });
  cb();
};

// buildTemplate 3
const moveAssets = (cb) => {
  //move from template folder to output (destination) folder
  const getTplNameFunc = getTplNameFunction();
  const templateName = getTplNameFunc() + "/";
  const templateFolder = getTplFolder() + "/";
  return src(
    config.SRC_PATH + templateFolder + templateName + "assets/**/*"
  ).pipe(dest(config.destination + "assets/"));
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
  const templateFolder = getTplFolder() + "/";
  console.log(
    "buildCss",
    "templateFolder:",
    templateFolder,
    "templateName:",
    templateName
  );
  const sources = [
    config.SRC_PATH + templateFolder + templateName + "index.scss",
  ];
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
  const templateFolder = getTplFolder() + "/";
  //config.SRC_PATH + templateFolder + templateName + "index.scss"
  const source = config.HAS_NUNJUCK_TPL
    ? config.SRC_PATH + "pages/" + pageName
    : getStandardLayout();
  // BRAND_PRODUCT_TYPE_DATE
  console.log(
    "buildNunjucks",
    "pageName:",
    pageName,
    "source:",
    source,
    "templateFolder:",
    templateFolder
  );
  //, { allowEmpty: true, debug: true }
  return (
    src(config.SRC_PATH + "pages/" + source + ".njk")
      .pipe(
        data(function (file) {
          //console.log("buildNunjucks data path: " + file.path);
          //BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_DATE
          const xlsxName = getXLSXName();
          console.log("buildNunjucks data xlsxName: " + xlsxName);
          const xlsxParser = geXlsxParser();
          console.log("buildNunjucks data xlsxParser:", xlsxParser);
          const filename =
            config.SRC_PATH + "xlsx/" + templateFolder + xlsxName + ".xlsx";
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
            //console.log("buildNunjucks tplValues:", tplValues);
            //console.log("buildNunjucks tplValues.module2:", tplValues.module2);
            //console.log("buildNunjucks tplValues.module3:", tplValues.module3);
            //let length = tplValues.modules.length;
            //console.log("buildNunjucks tplValues.module4:", tplValues.modules[length - 2]);
            //console.log("buildNunjucks tplValues.module5.table:", tplValues.modules[length - 1].table);
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
  const templateFolder = getTplFolder() + "/";
  //watch("./build/**/*.html").on("change", handleChange);
  //watch([config.SRC_PATH + 'js/*.js', '!' + config.SRC_PATH + 'js/*.min.js'], buildHtml);
  //watch(config.SRC_PATH + 'vendor/*.js', series(buildVendorJs));
  watch(
    config.SRC_PATH + templateFolder + templateName + "assets/**/*",
    buildTemplate
  );
  watch(
    config.SRC_PATH + templateFolder + templateName + "*.scss",
    buildTemplate
  );
  //watch(config.SRC_PATH + templateFolder + templateName + "index.html", buildHtml);
  watch(config.SRC_PATH + "js/*.js", buildJs);
  watch(config.SRC_PATH + "scss/*.scss", buildCss);
  watch(config.SRC_PATH + "pages/**/*.+(html|njk|nunjucks)", buildTemplate);
  watch(config.SRC_PATH + "templates/**/*.+(html|njk|nunjucks)", buildTemplate);
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
  console.log("zip", "folder:", col.dim, folder, col.reset);
  const stream = src([
    folder + "*",
    "!" + folder + "zip",
    "!" + folder + "*.*",
  ]).pipe(
    zipper({ destination: folder + "zip/", name: name }, (evt) => {
      console.log(evt.index, evt.file.path.split("/").pop());
    })
  );
  if (config.HAS_FOLDER_TO_ZIP) {
    // leave fallbacks folder by default: "!" + folder + "fallbacks"
    // get only folders inside directory without single files and zip folder
    return stream;
  }
  cb();
};

//Version 1: imagefolder with Language (CZ) and Type (Size-1-2) plus Module and folder (01_Module/02_jpg) inside
const makeImages = (cb) => {
  const folder = getTplFolder();
  const lang = getLanguage();
  const type = getType();
  const date = getDate();

  const path =
    config.SRC_PATH + "_images/" + folder + "/" + lang + "/" + type + "/";
  const log = "makeImages " + col.dim + " path: " + col.reset + path;

  console.log(log);

  const stream = src([path + "**/02_jpg/*.*"])
    .pipe(
      data(function (file) {
        //get start index '_images' folder
        let startIndex = -1;
        const pathSplit = file.path.split("/");
        for (let i = 0, l = pathSplit.length; i < l; i++) {
          const s = pathSplit[i];
          if (s === "_images") {
            startIndex = i + 1;
            break;
          }
        }
        const parts = pathSplit.slice(startIndex);
        const partIndex = parts[parts.length - 1];
        //get first part
        const index = partIndex.split("_").shift();
        console.log("pathSplit:", pathSplit);
        console.log("partIndex:", partIndex, "index:", index);
        const obj = {
          index: partIndex.indexOf("Banner") !== -1 ? -1 : parseInt(index, 10),
          module: Number(parts[3].split("_").shift()),
          dirname: parts[0] + "_" + parts[2] + "_" + parts[1] + "_" + date,
          destination: parts[0], //folder
        };
        //TODO: we should be using this - check out
        /* const obj = {
          index: partIndex.indexOf("Banner") !== -1 ? -1 : parseInt(index, 10),
          module: Number(parts[parts.length - 2].split("_").shift()),
          dirname: parts[0] + "_" + type + "_" + parts[1] + "_" + date,
          destination: parts[0], //folder
        }; */
        return obj;
      })
    )
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: config.JPEG_QUALITY, progressive: false }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(
      rename((path, file) => {
        //{"dirname":"03_Module/02_jpg","basename":"Banner_970x600","extname":".jpg"}
        //{"dirname":"04_Module/02_jpg","basename":"01_Feature_300x300","extname":".jpg"}
        //{"dirname":"05_Module/02_jpg","basename":"02_Premium_Protection_150x300","extname":".jpg"}
        /* return {
        dirname: path.dirname,
        basename: path.basename,
        extname: path.extname
      }; */
        //module-1.jpg | module-4-feature-1.jpg | module-5-product-3.jpg
        //get index out of path.basename
        //const part = path.basename.split('_').shift();
        let basename = "module-" + file.data.module;
        //check for feature or
        if (file.data.index !== -1) {
          if (file.data.module === 5) {
            basename += "-product-" + file.data.index;
          } else {
            basename += "-feature-" + file.data.index;
          }
        }
        //console.log("path:", JSON.stringify(path), "file.data:", file.data);
        console.log(col.dim, basename, col.reset);
        return {
          dirname: file.data.dirname + "/assets",
          //dirname: '.',
          basename: basename,
          extname: path.extname,
        };
      })
    )
    .pipe(
      dest(
        (file) => {
          //console.log('dest file.data:', file.data);
          // +++ activate this for testing images +++
          //return config.SRC_PATH + '_images/result/' + file.data.destination;
          return config.SRC_PATH + file.data.destination;
        },
        { overwrite: true }
      )
    );
  return stream;
  //cb();
};
//
//Version 2: imagefolder with Language (CZ) plus Module folder (01_Module) inside
// e.g.: _images/Pampers_Matisse-BabyDry/CZ/01_Module/Banner_Big_970x300.jpg
const makeImagesWithoutType = (cb) => {
  const folder = getTplFolder();
  const lang = getLanguage();
  const type = getType();
  const date = getDate();

  // _images/Pampers_Matisse-BabyDry/CZ/ 01_Module/Banner_Big_970x300.jpg
  const path = config.SRC_PATH + "_images/" + folder + "/" + lang + "/";
  let log = "makeImages " + col.dim + " path: " + col.reset + path;
  console.log(log);

  //VERION-2
  const stream = src([path + "**/*.*"])
    .pipe(
      data(function (file) {
        //get start index '_images' folder
        let startIndex = -1;
        const pathSplit = file.path.split("/");
        /* 
        pathSplit: [ '', 'Applications', 'MAMP', 'htdocs', 'egp', 'xlsx-content-builder', 'src', 'xlsx-template', '_images',
          'Pampers_Matisse-BabyDry',
          'SK',
          '03_Module',
          '03_Banner_970x600.jpg'
        ] 
        */
        for (let i = 0, l = pathSplit.length; i < l; i++) {
          const s = pathSplit[i];
          if (s === "_images") {
            startIndex = i + 1;
            break;
          }
        }
        const parts = pathSplit.slice(startIndex);
        const partIndex = parts[parts.length - 1];
        //get first part
        const index = partIndex.split("_").shift();
        const isBanner = partIndex.toUpperCase().indexOf("BANNER") !== -1;
        //console.log("pathSplit:", pathSplit);
        //console.log("partIndex:", partIndex, "startIndex:", startIndex, "index:", index);
        const obj = {
          index: isBanner ? -1 : parseInt(index, 10),
          module: Number(parts[parts.length - 2].split("_").shift()),
          dirname: parts[0] + "_" + type + "_" + parts[1] + "_" + date,
          destination: parts[0], //folder
        };
        /* console.log("::");
        log = "makeImages parts " + parts.join(', ');
        console.log(log);
        log = "makeImages obj " + JSON.stringify(obj);
        console.log(log); */
        return obj;
      })
    )
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: config.JPEG_QUALITY, progressive: false }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(
      rename((path, file) => {
        /* let date = new Date();
          file.stat.atime = date;
          file.stat.mtime = date; */
        //{"dirname":"03_Module/02_jpg","basename":"Banner_970x600","extname":".jpg"}
        //{"dirname":"04_Module/02_jpg","basename":"01_Feature_300x300","extname":".jpg"}
        //{"dirname":"05_Module/02_jpg","basename":"02_Premium_Protection_150x300","extname":".jpg"}
        /* return {
          dirname: path.dirname,
          basename: path.basename,
          extname: path.extname
        }; */
        //module-1.jpg | module-4-feature-1.jpg | module-5-product-3.jpg
        //get index out of path.basename
        //const part = path.basename.split('_').shift();
        let basename = "module-" + file.data.module;
        //check for feature or
        if (file.data.index !== -1) {
          if (file.data.module === 5) {
            basename += "-product-" + file.data.index;
          } else {
            basename += "-feature-" + file.data.index;
          }
        }
        //console.log("path:", JSON.stringify(path), "file.data:", file.data);
        console.log(col.dim, file.data.dirname, basename, col.reset);
        return {
          dirname: file.data.dirname + "/assets",
          //dirname: '.',
          basename: basename,
          extname: path.extname,
        };
      })
    )
    .pipe(
      dest(
        (file) => {
          //console.log('dest file.data:', file.data);
          return config.SRC_PATH + "_images/result/" + file.data.destination;
          //return config.SRC_PATH + file.data.destination;
        },
        { overwrite: true }
      )
    );
  return stream;
  //cb();
};
//
//Version 3: imagefolder with Language (CZ) plus Module folder (01_Module) inside
// e.g.: _images/Pampers_Pandora/Fresh-Clean/CZ/01_Module/Banner_Big_970x300.jpg
const makeImagesFolderType = (cb) => {
  const folder = getTplFolder();
  const lang = getLanguage();
  const type = getType();
  const date = getDate();
  // _images/Pampers_Pandora/Fresh-Clean/ CZ/01_Module/Banner_Big_970x300.jpg
  const path = config.SRC_PATH + "_images/" + folder + "/" + type + "/";
  let log = "makeImagesFolderType " + col.dim + " path: " + col.reset + path;
  console.log(log, "type:", type);

  //VERION-3
  const stream = src([path + "**/**/*.*"])
    .pipe(
      data(function (file) {
        //get start index '_images' folder
        let startIndex = -1;
        const pathSplit = file.path.split("/");
        /* 
        pathSplit: [ '', 'Applications', 'MAMP', 'htdocs', 'egp', 'xlsx-content-builder', 'src', 'xlsx-template', '_images',
          'Pampers_Matisse-BabyDry',
          'SK',
          '03_Module',
          '03_Banner_970x600.jpg'
        ] 
        */
        for (let i = 0, l = pathSplit.length; i < l; i++) {
          const s = pathSplit[i];
          if (s === "_images") {
            startIndex = i + 1;
            break;
          }
        }
        const parts = pathSplit.slice(startIndex);
        const partIndex = parts[parts.length - 1];
        //get first part
        const index = partIndex.split("_").shift();
        const language = parts[parts.length - 3];
        const isBanner = partIndex.toUpperCase().indexOf("BANNER") !== -1;
        console.log("parts:", parts.join("/"));
        console.log(
          "data:",
          "partIndex:",
          partIndex,
          "startIndex:",
          startIndex,
          "index:",
          index,
          "language:",
          language
        );
        const obj = {
          index: isBanner ? -1 : parseInt(index, 10),
          type:
            partIndex.indexOf("Feature") !== -1
              ? "feature"
              : isBanner
              ? "banner"
              : "product",
          language: parts[parts.length - 3],
          module: Number(parts[parts.length - 2].split("_").shift()),
          dirname: parts[0] + "_" + type + "_" + language + "_" + date,
          destination: parts[0], //folder
        };
        //log = "makeImages obj " + JSON.stringify(obj);
        //console.log(log);
        console.log("::");
        log = "makeImages parts " + parts.join(", ");
        console.log(log);
        log = "makeImages obj " + JSON.stringify(obj);
        console.log(log);
        return obj;
      })
    )
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: config.JPEG_QUALITY, progressive: false }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(
      rename((path, file) => {
        /* let date = new Date();
          file.stat.atime = date;
          file.stat.mtime = date; */
        //{"dirname":"03_Module/02_jpg","basename":"Banner_970x600","extname":".jpg"}
        //{"dirname":"04_Module/02_jpg","basename":"01_Feature_300x300","extname":".jpg"}
        //{"dirname":"05_Module/02_jpg","basename":"02_Premium_Protection_150x300","extname":".jpg"}
        /* return {
          dirname: path.dirname,
          basename: path.basename,
          extname: path.extname
        }; */
        //module-1.jpg | module-4-feature-1.jpg | module-5-product-3.jpg
        //get index out of path.basename
        //const part = path.basename.split('_').shift();
        let basename = "module-" + file.data.module;
        //check for feature or
        if (file.data.index !== -1) {
          if (file.data.type === "product") {
            basename += "-product-" + file.data.index;
          } else {
            basename += "-feature-" + file.data.index;
          }
        }
        //console.log("path:", JSON.stringify(path), "file.data:", file.data);
        console.log(
          "rename:",
          col.dim,
          file.data.dirname,
          col.reset,
          basename,
          file.data.language
        );
        return {
          dirname: file.data.dirname + "/assets",
          //dirname: '.',
          basename: basename,
          extname: path.extname,
        };
      })
    )
    .pipe(
      dest(
        (file) => {
          //console.log('dest file.data:', file.data);
          //return config.SRC_PATH + "_images/result/" + file.data.destination;
          return config.SRC_PATH + file.data.destination;
        },
        { overwrite: true }
      )
    );
  return stream;
  //cb();
};

//
//
function getOutputData(path) {
  const templateFolder = path.split("/").slice(-2)[0];
  const folder = path.split("/").slice(-1)[0];
  let parts = folder.split("_");
  const brand = parts[0];
  const product = parts[1];
  const type = parts[2];
  const language = parts.slice(-2)[0];
  parts.splice(parts.length - 1, 0, "1");
  const xlsxName = parts.join("_");
  const output = templateFolder + "/" + getOutputNameByTemplate(xlsxName);
  return {
    bodyClass: "mobile",
    jsCssName: "index.min",
    brand: brand,
    product: product,
    type: type,
    path: path,
    template: folder,
    templateFolder: templateFolder,
    title: xlsxName,
    language: language,
    output: output,
    version: getVersion(),
  };
}

function printOutputFolders(cb) {
  let stream = [];
  stream.add = (item) => {
    stream.push(item);
  };
  //
  //config.OUTPUT_FOLDERS.splice(0);
  const templateFolder = getTplFolder();
  console.log(
    "printOutputFolders templateFolder: ",
    config.SRC_PATH + "xlsx/" + templateFolder
  );
  // LOG FILES
  stream.add(
    // except _images, pages, scss, js, xlsx and templates
    //src([config.SRC_PATH + "*/*", //product folders inside xlsx-template
    //src([config.SRC_PATH + "*/**", //concrete type folder
    //config.TEMPLATE_SRC + "/*/**/*.*", //all files plus .scss
    //config.TEMPLATE_SRC + "/*/**/assets/**/*", //move assets
    src([config.SRC_PATH + "xlsx/" + templateFolder + "/*.xlsx"]).pipe(
      data((file) => {
        const obj = getOutputData(file.path);
        console.log("+++ printOutputFolders obj: ", obj);
        console.log("+++ printOutputFolders file.path: ", file.path);
        //config.OUTPUT_FOLDERS.push(obj);
        //console.log("+++ addOutputFolders data config.OUTPUT_FOLDERS: ", config.OUTPUT_FOLDERS);
        return obj;
      })
    )
  );
  if (stream.length) {
    return merge2(stream);
  }
  cb();
}

function addOutputFolders(cb) {
  let stream = [];
  stream.add = (item) => {
    stream.push(item);
  };
  //
  config.OUTPUT_FOLDERS.splice(0);
  //get sources from BRAND
  // (in future versions there may be more than one brand per config!)
  const sourcesTemplates = [];
  //SRC_PATH = "./src/xlsx-template/"
  const brandNames = config.TPL_NAMES.BRAND;
  const productNames = config.TPL_NAMES.PRODUCT;
  for (let i = 0, l = brandNames.length; i < l; i++) {
    for (let c = 0, ll = productNames.length; c < ll; c++) {
      sourcesTemplates.push(
        config.SRC_PATH + brandNames[i] + "/" + productNames[c] + "/*/"
      );
    }
  }
  const sources = [...new Set(sourcesTemplates)];
  let counter = 0;
  console.log("addOutputFolders", col.fg.yellow, sourcesTemplates, col.reset);
  console.log("addOutputFolders", col.fg.yellow, sources, col.reset);
  // LOG FILES
  stream.add(
    // except _images, pages, scss, js, xlsx and templates
    //src([config.SRC_PATH + "*/*", //product folders inside xlsx-template
    //src([config.SRC_PATH + "*/**", //concrete type folder
    //config.TEMPLATE_SRC + "/*/**/*.*", //all files plus .scss
    //config.TEMPLATE_SRC + "/*/**/assets/**/*", //move assets
    src([...sources, ...config.SRC_PATH_BUILD_IGNORES]).pipe(
      data((file) => {
        const obj = getOutputData(file.path);
        console.log("addOutputFolders folder:", (++counter), file.path);
        //console.log("addOutputFolders folder: ", obj);
        config.OUTPUT_FOLDERS.push(obj);
        //console.log("+++ addOutputFolders data config.OUTPUT_FOLDERS: ", config.OUTPUT_FOLDERS);
        return obj;
      })
    )
  );
  if (stream.length) {
    return merge2(stream);
  }
  cb();
}

function moveOutputAssets(cb) {
  const destination = config.DEVELOPMENT
    ? config.DEV_FOLDER
    : config.BUILD_FOLDER;
  //
  console.log(
    "moveOutputAssets TEMPLATE_SRC:",
    config.TPL_NAMES.BRAND[0] + "_" + config.TPL_NAMES.PRODUCT[0],
    config.TEMPLATE_SRC
  );
  //
  // MOVE IMAGES INTO FOLDER
  return (
    src([
      config.TEMPLATE_SRC + "/*/assets/*.*",
      ...config.SRC_PATH_BUILD_IGNORES,
    ])
      //.pipe(rename("main/text/ciao/goodbye.md"))
      .pipe(
        rename((path) => {
          const name = path.dirname.split("/")[0];
          const dirname = getOutputNameByTemplate(name);
          console.log(
            "moveOutputAssets rename",
            "name:",
            name,
            "dirname:",
            dirname
          );
          return {
            dirname: dirname + "/assets",
            basename: path.basename,
            extname: path.extname,
          };
        })
      )
      .pipe(
        dest(
          (file) => {
            const parts = file.path.split("/");
            const templateFolder = parts.slice(-4)[0];
            //console.log("moveOutputAssets LAST STREAM templateFolder:", templateFolder);
            return config.TEST_FOLDER + "/" + templateFolder;
          },
          { overwrite: true }
        )
      )
  );
}

function buildTemplatesCSS(cb) {
  const destination = config.DEVELOPMENT
    ? config.DEV_FOLDER
    : config.BUILD_FOLDER;
  //
  //const tplFolderName = config.TPL_NAMES.BRAND[0] + "_" + config.TPL_NAMES.PRODUCT;
  console.log("buildTemplatesCSS TEMPLATE_SRC: " + config.TEMPLATE_SRC);
  //
  // SCSS TO CSS
  const output = config.DEVELOPMENT ? "expanded" : "compressed";
  const processors = [autoprefixer, flexbugsfixer];
  return (
    src(
      [
        config.TEMPLATE_SRC + "/*/**/index.scss",
        ...config.SRC_PATH_BUILD_IGNORES,
      ],
      { sourcemaps: config.DEVELOPMENT }
    )
      .pipe(
        data((file) => {
          const parts = file.path.split("/");
          const fileName = parts.pop();
          const path = parts.join("/");
          console.log("buildTemplatesCSS data fileName: ", fileName);
          const obj = getOutputData(path);
          return obj;
        })
      )
      .pipe(
        sass
          .sync({
            outputStyle: output,
            precision: 10,
            includePaths: [],
          })
          .on("error", sass.logError)
      )
      .pipe(postcss(processors))
      .pipe(gulpif(!config.DEVELOPMENT, cssnano({ safe: true })))
      .pipe(rename("index.min.css"))
      //SOLO TURN - we allready got the template folder stream
      .pipe(
        dest(
          (file) => {
            return config.TEST_FOLDER + file.data.output + "/css/";
          },
          { overwrite: true }
        ),
        {
          sourcemaps: ".",
        }
      )
  );
}

function buildTemplatesJS(cb) {
  let stream = [];
  stream.add = (item) => {
    stream.push(item);
  };
  //
  //sources, name, destination, minified
  const sourcesJS = config.DEVELOPMENT
    ? [config.SRC_PATH + "js/flex-slider.js", config.SRC_PATH + "js/index.js"]
    : [config.SRC_PATH + "js/flex-slider.js"];
  const name = "index.min";
  //const destination = config.destination + "js";
  /* const name = config.DEVELOPMENT
    ? "index.min"
    : "index." + config.UID + ".min"; */
  //
  //loop over destinations and add to pipeline
  config.OUTPUT_FOLDERS.forEach((pData) => {
    console.log("loop over", pData);
    stream.add(
      src(sourcesJS)
        .pipe(concat(name + ".js"))
        .pipe(
          data((file) => {
            //here we return output folders data for our JS
            return pData;
          })
        )
        .pipe(
          gulpif(
            !config.DEVELOPMENT,
            removeLogging({
              methods: ["log", "info"],
            })
          )
        )
        .pipe(
          gulpif(
            !config.DEVELOPMENT,
            uglify({
              output: {
                comments: saveLicense,
              },
            })
          )
        )
        .pipe(
          dest(
            (file) => {
              console.log(
                "buildTemplatesJS LAST STREAM file.data:",
                file.data.output + "/js/"
              );
              return config.TEST_FOLDER + file.data.output + "/js/";
            },
            { overwrite: true }
          )
        )
    );
  });
  if (stream.length) {
    return merge2(stream);
  }
  cb();
}

function buildTemplatesNunjucks() {
  let stream = [];
  stream.add = (item) => {
    stream.push(item);
  };
  //obj.jsCssName = config.DEVELOPMENT ? "index.min" : "index." + config.UID + ".min";
  //, { allowEmpty: true, debug: true }
  config.OUTPUT_FOLDERS.forEach((pData) => {
    console.log("buildTemplatesNunjucks loop over", pData);
    const templateFolder = pData.templateFolder;
    const xlsxName = pData.title;
    //console.log("buildTemplatesNunjucks loop over xlsxName:", xlsxName);
    const extendTemplateVars = (obj) => {
      if (typeof obj !== "object") {
        obj = {};
      }
      //copy
      for (let key in pData) {
        if (pData.hasOwnProperty(key)) {
          obj[key] = pData[key];
        }
      }
      return obj;
    };
    //get nunjucks pages via name (.njk)
    // BRAND_PRODUCT_TYPE_DATE
    //this is the standard: generic nunjucks template
    const source = getStandardLayout();
    stream.add(
      src(config.SRC_PATH + "pages/" + source + ".njk")
        .pipe(
          data(function (file) {
            //console.log("buildTemplatesNunjucks data path: " + file.path);
            //pageName | templateFolder | xlsxName
            //BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_DATE
            console.log("buildTemplatesNunjucks data xlsxName: " + xlsxName);
            //tplNames.XLSX_PARSER[index]
            const xlsxParser = XLSX_TYPE_ENUM.PARSER_STD_MODULE;
            console.log("buildTemplatesNunjucks data xlsxParser:", xlsxParser);
            const filename =
              config.SRC_PATH +
              "xlsx/" +
              templateFolder +
              "/" +
              xlsxName +
              ".xlsx";
            console.log("buildTemplatesNunjucks data filename:", filename);
            // try to get the sheet named 'Template' FROM workbook HERE
            try {
              const workbook = XLSX.read(filename, { type: "file" });
              //console.log("buildTemplatesNunjucks data workbook:", workbook);
              //Call simple factory method
              const tplValues = XLSXParserFactory.create(
                xlsxParser,
                workbook.Sheets.Template
              );
              extendTemplateVars(tplValues);
              //console.log("buildTemplatesNunjucks tplValues:", tplValues);
              //console.log("buildTemplatesNunjucks tplValues.module2:", tplValues.module2);
              //console.log("buildTemplatesNunjucks tplValues.module3:", tplValues.module3);
              //let length = tplValues.modules.length;
              //console.log("buildTemplatesNunjucks tplValues.module4:", tplValues.modules[length - 2]);
              //console.log("buildTemplatesNunjucks tplValues.module5.table:", tplValues.modules[length - 1].table);
              return tplValues;
            } catch (error) {
              console.log("*");
              console.log("buildTemplatesNunjucks data catch error:", error);
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
        .pipe(
          dest(
            (file) => {
              console.log(
                "buildTemplatesNunjucks LAST STREAM file.data:",
                file.data.output
              );
              return config.TEST_FOLDER + file.data.output + "/";
            },
            { overwrite: true }
          )
        )
    );
  });

  if (stream.length) {
    return merge2(stream);
  }
  cb();
}

// GULP SERIES
const buildTemplate = series(
  setDestination,
  //cleanDirectory,
  moveAssets,
  parallel(buildCss, buildJs, setConfigHasNunjuckTpl),
  buildNunjucks
);

const buildTemplateViaHtml = series(
  setDestination,
  cleanDirectory,
  moveAssets,
  parallel(buildCss, buildJs, setConfigHasNunjuckTpl),
  buildHtml
);

//const buildTemplatesCSS = series();

// EXPORTS
exports.default = series(
  enableDevelopment,
  setUID,
  //plus .zip bundles (complete)
  buildTemplate,
  watchDirectory,
  reloadBrowser
);
exports.dev = series(
  setUID,
  //printOutputFolders,
  addOutputFolders
  /* moveOutputAssets,
  buildTemplatesCSS,
  buildTemplatesJS,
  buildTemplatesNunjucks */
);

exports.images = series(
  enableDevelopment,
  setDestination,
  makeImagesWithoutType,
  next,
  makeImagesWithoutType,
  next,
  makeImagesWithoutType,
  next,
  makeImagesWithoutType,
  next,
  makeImagesWithoutType,
  next,
  makeImagesWithoutType,
  next,
  makeImagesWithoutType
);
//
exports.imagesFolderType = series(
  enableDevelopment,
  setDestination,
  makeImagesFolderType,
  next,
  makeImagesFolderType
  /* next,
  makeImagesFolderType,
  next,
  makeImagesFolderType,
  next,
  makeImagesFolderType,
  next,
  makeImagesFolderType,
  next,
  makeImagesFolderType,
  next,
  makeImagesFolderType,
  next,
  makeImagesFolderType,
  next,
  makeImagesFolderType, */
);

//
/* exports.dev = series(
  enableDevelopment,
  cleanZipFolder,
  setUID,
  setStartTemplate,
  buildTemplate,
  //repeat this until end of templates
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  //TEMP START
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  //TEMP END
  setConfigHasFolderToZip,
  zip
); */

exports.build = series(
  enableProduction,
  cleanZipFolder,
  cleanDirectory,
  setUID,
  setStartTemplate,
  buildTemplate,
  //repeat this until end of templates
  next,
  buildTemplate,
  /* next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate,
  next,
  buildTemplate, */
  setConfigHasFolderToZip,
  zip
);

exports.cleanAll = series(cleanAll);

exports.cleanBuild = series(cleanBuild);

//unused
/* exports.html = series(
  enableDevelopment,
  setUID,
  buildTemplateViaHtml,
  watchDirectory,
  reloadBrowser
); */
//################## ABLAUF NEUES PROJEKT #####################

//1.  Create Folder inside src/xlsx-template/_images with project-name/Language/01_Module - xx_Module
//2.  Run 'gulp images' - this will create a folder with the same name plus assets folder inside  src/xlsx-template/

//3.  Create new config file inside gulpfile.js/config/ and change this:
//    const { TPL_NAMES } = require("./config/P-MATISSE-BABYDRY"); inside gulp-config.js at the top
//4.  Check for existing and matching XLSXParser - if not, create a new one
//5.  Add new XLSXParser enum inside XLSXParserEnum.js
//6.  Open XLSXParserFactory.js and implement the newly created parser via XLSXParserEnum type
//7.  Create same name folder without type and language short inside src/xlsx-template/xlsx/
//8.  Place xlsx files named with type and language inside
//9.  Adjust XLSXParser according to match fields for parsing
//10. Create matching layout.njk inside src/xlsx-template/templates/
//11.

//+++ R.I.P. +++
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
