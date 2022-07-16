/**
 * GULP XLSX HELPER gulp-xlsx-helper.js
 * AUTHOR: J. Pfeifer (c) 2022
 * LICENSE: GNU GENERAL PUBLIC LICENSE
*/
//const { watch, series, parallel, src, dest } = require('gulp');

//const fs = require('fs');
//const path = require("path");
//const zipper = require("zip-local");

const XLSX_TYPE_ENUM = {
  ORAL_B_KIDS_1_4_4_1_FLEX_3: "ORAL-B-KIDS-LIGHTYEAR-1-4-4-1-FLEX-3",
  ORAL_B_PRO3_1_4_4_1_FLEX_4: "ORAL-B-PRO3-1-4-4-1-FLEX-4",
};

let Template = null;
let Values = {};

function setFieldValue(module, key, name, type, splitter) {
  if (!Values[module]) {
    Values[module] = {};
  }
  //fallback(!) nur wenn kein key angegeben wurde
  const nVal = typeof name !== 'undefined' ? name : key;
  //setFieldValue("module5", "BLANK", "table-0", "ARRAY");
  //setFieldValue("module5", "AC36", "table-0", "ARRAY");
  try {
    let value = key === "BLANK" ? "" : Template[key].v || "";
    let obj = { key: key, value: value };
    if (typeof splitter !== "undefined") {
      obj.spl = value.split(splitter);
    }
    if (type && type === "TABLE") {
      if (!Values[module].table) {
        Values[module].table = [];
      }
      //make array, if not allready exists!
      //nVal is index if TABLE
      if (!Values[module].table[nVal]) {
        Values[module].table[nVal] = [];
      }
      Values[module].table[nVal].push(obj);
      console.log("setFieldValue", "nVal:", nVal, "obj:", obj);
    } else if (type && type === "ARRAY") {
      //make array, if not allready exists!
      if (!Values[module][nVal]) {
        Values[module][nVal] = [];
      }
      Values[module][nVal].push(obj);
    } else {
      Values[module][nVal] = obj;
    }
  } catch (error) {
    console.log("* setFieldValue catch");
    console.log(
      "*** Try to read key:",
      "'" + key + "' inside Template - we SKIP this one! ***"
    );
    console.log("*** ERROR:", error.message);
    console.log("*");
  }
}

module.exports.XLSX_TYPE_ENUM = XLSX_TYPE_ENUM;

module.exports.getTemplate = () => {
  return Template;
};

module.exports.setTemplate = (tpl) => {
  Template = tpl;
};

module.exports.getTemplateValues = () => {
  return Values;
};

module.exports.setTemplateValues = (type) => {
  //FIRST RESET VALUES OBJECT
  Values = {};
  //
  if (type === XLSX_TYPE_ENUM.ORAL_B_KIDS_1_4_4_1_FLEX_3) {
    setFieldValue("module1", "Y4", "headline");
    setFieldValue("module1", "Y6", "image-alt");

    setFieldValue("module2", "Y14", "headline", "ARRAY");
    setFieldValue("module2", "Y15", "copy", "ARRAY");
    setFieldValue("module2", "AC14", "headline", "ARRAY");
    setFieldValue("module2", "AC15", "copy", "ARRAY");
    setFieldValue("module2", "AG14", "headline", "ARRAY");
    setFieldValue("module2", "AG15", "copy", "ARRAY");
    setFieldValue("module2", "AK14", "headline", "ARRAY");
    setFieldValue("module2", "AK15", "copy", "ARRAY");

    setFieldValue("module3", "Y21", "headline", "ARRAY");
    setFieldValue("module3", "Y22", "copy", "ARRAY", "\n\n");
    setFieldValue("module3", "AC21", "headline", "ARRAY");
    setFieldValue("module3", "AC22", "copy", "ARRAY");
    setFieldValue("module3", "AG21", "headline", "ARRAY");
    setFieldValue("module3", "AG22", "copy", "ARRAY", "\n\n");
    setFieldValue("module3", "AK21", "headline", "ARRAY");
    setFieldValue("module3", "AK22", "copy", "ARRAY");

    setFieldValue("module4", "Y27", "image-alt");

    setFieldValue("module5", "Y33", "headline");

    setFieldValue("module5", "BLANK", 0, "TABLE");
    setFieldValue("module5", "AC36", 0, "TABLE");
    setFieldValue("module5", "AE36", 0, "TABLE");
    setFieldValue("module5", "AG36", 0, "TABLE");

    setFieldValue("module5", "Y37", 1, "TABLE");
    setFieldValue("module5", "AC37", 1, "TABLE");
    setFieldValue("module5", "AE37", 1, "TABLE");
    setFieldValue("module5", "AG37", 1, "TABLE");

    setFieldValue("module5", "Y38", 2, "TABLE");
    setFieldValue("module5", "AC38", 2, "TABLE");
    setFieldValue("module5", "AE38", 2, "TABLE");
    setFieldValue("module5", "AG38", 2, "TABLE");

    setFieldValue("module5", "Y39", 3, "TABLE");
    setFieldValue("module5", "AC39", 3, "TABLE");
    setFieldValue("module5", "AE39", 3, "TABLE");
    setFieldValue("module5", "AG39", 3, "TABLE");

    setFieldValue("module5", "Y40", 4, "TABLE");
    setFieldValue("module5", "AC40", 4, "TABLE");
    setFieldValue("module5", "AE40", 4, "TABLE");
    setFieldValue("module5", "AG40", 4, "TABLE");

    setFieldValue("module5", "Y41", 5, "TABLE");
    setFieldValue("module5", "AC41", 5, "TABLE");
    setFieldValue("module5", "AE41", 5, "TABLE");
    setFieldValue("module5", "AG41", 5, "TABLE");

    setFieldValue("module5", "Y42", 6, "TABLE");
    setFieldValue("module5", "BLANK", 6, "TABLE");
    setFieldValue("module5", "BLANK", 6, "TABLE");
    setFieldValue("module5", "AG42", 6, "TABLE");

    setFieldValue("module5", "Y43", 7, "TABLE");
    setFieldValue("module5", "BLANK", 7, "TABLE");
    setFieldValue("module5", "AE43", 7, "TABLE");
    setFieldValue("module5", "AG43", 7, "TABLE");

    setFieldValue("module5", "Y44", 8, "TABLE");
    setFieldValue("module5", "AC44", 8, "TABLE");
    setFieldValue("module5", "BLANK", 8, "TABLE");
    setFieldValue("module5", "AG44", 8, "TABLE");
  } else if (type === XLSX_TYPE_ENUM.ORAL_B_PRO3_1_4_4_1_FLEX_4) {
    setFieldValue("module1", "Y4", "headline");
    setFieldValue("module1", "Y6", "image-alt");

    setFieldValue("module2", "Y14", "headline", "ARRAY");
    setFieldValue("module2", "Y15", "copy", "ARRAY");
    setFieldValue("module2", "AC14", "headline", "ARRAY");
    setFieldValue("module2", "AC15", "copy", "ARRAY");
    setFieldValue("module2", "AG14", "headline", "ARRAY");
    setFieldValue("module2", "AG15", "copy", "ARRAY");
    setFieldValue("module2", "AK14", "headline", "ARRAY");
    setFieldValue("module2", "AK15", "copy", "ARRAY");

    setFieldValue("module3", "Y21", "headline", "ARRAY");
    setFieldValue("module3", "Y22", "copy", "ARRAY");
    setFieldValue("module3", "AC21", "headline", "ARRAY");
    setFieldValue("module3", "AC22", "copy", "ARRAY");
    setFieldValue("module3", "AG21", "headline", "ARRAY");
    setFieldValue("module3", "AG22", "copy", "ARRAY");
    setFieldValue("module3", "AK21", "headline", "ARRAY");
    setFieldValue("module3", "AK22", "copy", "ARRAY");

    setFieldValue("module4", "Y27", "image-alt");

    setFieldValue("module5", "Y33", "headline");

    setFieldValue("module5", "Y33", "headline");

    setFieldValue("module5", "BLANK", 0, "ARRAY");
    setFieldValue("module5", "AC36", 0, "ARRAY");
    setFieldValue("module5", "AE36", 0, "ARRAY");
    setFieldValue("module5", "AG36", 0, "ARRAY");
    setFieldValue("module5", "AI36", 0, "ARRAY");

    setFieldValue("module5", "Y37", 1, "ARRAY");
    setFieldValue("module5", "AC37", 1, "ARRAY");
    setFieldValue("module5", "AE37", 1, "ARRAY");
    setFieldValue("module5", "AG37", 1, "ARRAY");
    setFieldValue("module5", "AI37", 1, "ARRAY");

    setFieldValue("module5", "Y38", 2, "ARRAY");
    setFieldValue("module5", "AC38", 2, "ARRAY");
    setFieldValue("module5", "AE38", 2, "ARRAY");
    setFieldValue("module5", "AG38", 2, "ARRAY");
    setFieldValue("module5", "BLANK", 2, "ARRAY");

    setFieldValue("module5", "Y39", 3, "ARRAY");
    setFieldValue("module5", "BLANK", 3, "ARRAY");
    setFieldValue("module5", "AE39", 3, "ARRAY");
    setFieldValue("module5", "BLANK", 3, "ARRAY");
    setFieldValue("module5", "BLANK", 3, "ARRAY");

    setFieldValue("module5", "Y40", 4, "ARRAY");
    setFieldValue("module5", "AC40", 4, "ARRAY");
    setFieldValue("module5", "AE40", 4, "ARRAY");
    setFieldValue("module5", "AG40", 4, "ARRAY");
    setFieldValue("module5", "AI40", 4, "ARRAY");

    setFieldValue("module5", "Y41", 5, "ARRAY");
    setFieldValue("module5", "BLANK", 5, "ARRAY");
    setFieldValue("module5", "AE41", 5, "ARRAY");
    setFieldValue("module5", "BLANK", 5, "ARRAY");
    setFieldValue("module5", "BLANK", 5, "ARRAY");

    setFieldValue("module5", "Y42", 6, "ARRAY");
    setFieldValue("module5", "BLANK", 6, "ARRAY");
    setFieldValue("module5", "AE42", 6, "ARRAY");
    setFieldValue("module5", "BLANK", 6, "ARRAY");
    setFieldValue("module5", "BLANK", 6, "ARRAY");
  }
};

module.exports.createDirectory = (dir, cb) => {
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) {
      // ignore the error if the folder already exists
      if (err.code == "EEXIST") {
        cb(null);
      } else {
        // something else went wrong
        cb(err);
      }
    } else {
      // successfully created folder
      cb(null);
    }
  });
};
