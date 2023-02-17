/**
 * GULP ALZA RESPONSIVE CONTENT BUILDER TOOL
 * AUTHOR: J. Pfeifer (c) 2021-2022
 */
const { col } = require("./console-col");
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
const mergeStream = require("merge2");
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
  getTplFolder,
  getTplName,
  getZipName,
  getXLSXName,
  getOutputName,
  geXlsxParser,
  extendTemplateVars,
  nextIndex,
  //resetIndex,
  getDate,
  getType,
  getLanguage,
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
  /* const getTplNameFunc = getTplNameFunction();
  const templateName = getTplNameFunc() + "/";
  const templateFolder = getTplFolder() + "/"; */
  //config.SRC_PATH + templateFolder + templateName + "index.scss"

  // BRAND_PRODUCT_TYPE_DATE
  console.log(
    "buildNunjucks",
    "pageName:",
    pageName,
    "templateFolder:",
    templateFolder
  );
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
            //console.log("buildNunjucks tplValues.module4:", tplValues.module4);
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
    buildTemplateDev
  );
  watch(
    config.SRC_PATH + templateFolder + templateName + "*.scss",
    buildTemplateDev
  );
  //watch(config.SRC_PATH + templateFolder + templateName + "index.html", buildHtml);
  watch(config.SRC_PATH + "js/*.js", buildJs);
  watch(config.SRC_PATH + "scss/*.scss", buildCss);
  watch(config.SRC_PATH + "pages/**/*.+(html|njk|nunjucks)", buildTemplateDev);
  watch(
    config.SRC_PATH + "templates/**/*.+(html|njk|nunjucks)",
    buildTemplateDev
  );
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
        const pathSplit = file.path.split("/");
        const parts = pathSplit.slice(-6);
        //[ 'Pampers_Mojito-BabyDry', 'CZ', 'Size-1-2', '01_Module', '02_jpg', 'Banner_970x600.jpg' ]
        //[ '04_Module', '02_jpg', '03_Feature_300x300.jpg' ]
        //[ '05_Module', '02_jpg', '01_Pampers_Harmonie_150x300.jpg' ]
        //console.log(col.dim, file.path.split('/').slice(-6), col.reset);
        //
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
//Version 2: imagefolder with Language (CZ) plus Module folder (01_Module) inside
const makeImagesWithoutType = (cb) => {
  const folder = getTplFolder();
  const lang = getLanguage();
  const type = getType();
  const date = getDate();

  //const path = config.SRC_PATH + '_images/' + folder + '/' + lang + '/' + type + '/';
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
        /* pathSplit: [
        '',
        'Applications',
        'MAMP',
        'htdocs',
        'egp',
        'xlsx-content-builder',
        'src',
        'xlsx-template',
        '_images',
        'Pampers_Matisse-BabyDry',
        'SK',
        '03_Module',
        '03_Banner_970x600.jpg'
      ] */
        for (let i = 0, l = pathSplit.length; i < l; i++) {
          const s = pathSplit[i];
          if (s === "_images") {
            startIndex = i + 1;
            break;
          }
        }
        const parts = pathSplit.slice(startIndex);
        //[ Pampers_Matisse-BabyDry, CZ, 01_Module, 01_Banner_970x600.jpg ] (-4)

        //[ 'Pampers_Mojito-BabyDry', 'CZ', 'Size-1-2', '01_Module', '02_jpg', 'Banner_970x600.jpg' ] (-6)
        //const index = parts[5].split('_').shift();
        const partIndex = parts[parts.length - 1];
        //get first part
        const index = partIndex.split("_").shift();
        //console.log("pathSplit:", pathSplit);
        console.log(
          "partIndex:",
          partIndex,
          "startIndex:",
          startIndex,
          "index:",
          index
        );
        const obj = {
          index: partIndex.indexOf("Banner") !== -1 ? -1 : parseInt(index, 10),
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

const moveDefaultScss = (cb) => {
  const folder = getTplFolder();
  const lang = getLanguage();
  const type = getType();
  const date = getDate();

  //return src([config.SRC_PATH + 'scss/index-default.scss'])
  return src([
    config.SRC_PATH + "**/*",
    "!" + config.SRC_PATH + "scss/**",
    "!" + config.SRC_PATH + "_images/**",
    "!" + config.SRC_PATH + "js/**",
    "!" + config.SRC_PATH + "pages/**",
    "!" + config.SRC_PATH + "templates/**",
    "!" + config.SRC_PATH + "xlsx/**",
  ]).pipe(
    data(function (file) {
      console.log("moveDefaultScss", file.path);
    })
  );
  /* .pipe(
      rename('index.scss')
    )
    .pipe(
      dest('')
    ); */
};

const buildStream = (cb) => {
  let counter = 0;
  let go = true;
  let json = null;
  const stream = mergeStream();
  const noobFn = () => {};
  //let stream = [];
  //stream.add = (item) => { stream.push(item); };
  while (counter < 4) {
    console.log("buildStream", "counter:", counter);
    //setDestination(noobFn);
    //cleanDirectory(noobFn);
    stream.add(
      src(config.SRC_PATH + "config.json").pipe(
        data(function (file) {
          /* for (let key in file) {
          console.log("buildStream", "data", "file key:", key, "value:", file[key]);
        } */
          json = JSON.parse(file._contents.toString());
          //console.log("buildStream", "data", "file json:", json);
          //console.log("buildStream", "data", "file path:", file.path);
          setDestination(noobFn);
          console.log("");
          console.log(
            "buildStream",
            "data",
            "config destination:",
            config.destination
          );
          cleanDirectory(noobFn);
          return json;
        })
      )
    );
    stream.add(moveAssets(cb));
    stream.add(buildCss(cb));
    stream.add(buildJs(cb));
    stream.add(
      buildNunjucks(cb).pipe(
        data(function (file) {
          console.log("buildStream", "data", "file.data:", file.data);
          //console.log("buildStream", "data", "file.data:", con.data);
          go = nextIndex();
        })
      )
    );
    //stream.add(next(noobFn));
    counter++;
    //let go = nextIndex();
    /* if (config.CURRENT > config.EXPORT_LENGTH - 1) {
      console.log("buildStream", "go:", go, "config.CURRENT > config.EXPORT_LENGTH - 1:", (config.CURRENT > config.EXPORT_LENGTH - 1));
      //cb();
      return stream;
    } */
  }
  if (stream.length) {
    return stream;
  }
  cb();
};

// GULP SERIES

const buildTemplate = series(
  setDestination,
  cleanDirectory,
  moveAssets,
  parallel(buildCss, buildJs),
  buildNunjucks
);

const buildTemplateDev = series(
  buildTemplate
  //setConfigHasFolderToZip,
  //zip
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
  //plus .zip bundles (complete)
  buildTemplateDev,
  watchDirectory,
  reloadBrowser
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
  makeImagesWithoutType
);

//unused
exports.html = series(
  enableDevelopment,
  setUID,
  buildTemplateViaHtml,
  watchDirectory,
  reloadBrowser
);
//unused
exports.dev = series(
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
  next,
  buildTemplate,
  next,
  buildTemplate,
  setConfigHasFolderToZip,
  zip
);

exports.build = series(
  enableProduction,
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
  next,
  buildTemplate,
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
  buildTemplate, */
  setConfigHasFolderToZip,
  zip
);

exports.cleanAll = series(cleanAll);

exports.cleanBuild = series(cleanBuild);

//################## ABLAUF NEUES PROJEKT #####################

//1.  Create Folder inside src/xlsx-template/_images with project-name/Language/01_Module - xx_Module
//2.  Run 'gulp images' - this will create a folder with the same name plus assets folder inside  src/xlsx-template/
//3.  Create new config file inside gulpfile.js/config/ and change this:
//    const { TPL_NAMES } = require("./config/MATISSE-BABYDRY"); inside gulp-config.js at the top
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
