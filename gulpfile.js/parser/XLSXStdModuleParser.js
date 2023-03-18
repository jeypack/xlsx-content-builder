const { obj } = require("through2");
const { XLSXParser } = require("./XLSXParser");
/**
 * XLSXStdModuleParser XLSXStdModuleParser.js
 * AUTHOR: J. Pfeifer (c) 2023
 * Created: 20.09.2023
 */
class XLSXStdModuleParser extends XLSXParser {
  /* constructor(template) {
    super(template);
    console.log("XLSXStdModuleParser constructor");
  } */

  _getModuleType(index) {
    let type = XLSXParser.MOD_TYPE_STD;
    let startNum = this.captionStartNums[index];
    let indexImage = startNum + 1;
    //console.log("_getModuleType", "START:");
    //console.log("_getModuleType", "index:", index, "startNum:", startNum);
    //index of caption : +1 is 'Image'
    let obj = this._setFieldValue("check", "AB" + indexImage, "testArray");
    //console.log("_getModuleType", "obj:", obj, "AB" + indexImage, "");
    if (obj) {
      type = XLSXParser.MOD_TYPE_ARRAY;
    }
    obj = this._setFieldValue("check", "AD" + indexImage, "testTable");
    //console.log("_getModuleType", "obj:", obj, "AD" + indexImage);
    if (obj) {
      type = XLSXParser.MOD_TYPE_TABLE;
    }
    return type;
  }

  _setStdModule(index) {
    //set module
    let startNum = this.captionStartNums[index];
    let module = "module" + (index + 1);
    this._setFieldValue(module, "BLANK", "moduleTypeSTD");
    //console.log(" ");
    //console.log("_setStdModule", "module", module);
    /* 
    Caption
    Image
    Header
    Body Description
    ... or ...
    Caption
    Image 
    Alt Text
    Header
    Body Description  
    */
    this._setFieldValue(module, "Y" + startNum, "headline");
    let obj = this._setFieldValue(module, "Y" + (startNum + 2), "image-alt");
    if (!obj) {
      obj = this._setFieldValue(module, "Y" + (startNum + 1), "image-alt");
      if (!obj) {
        obj = this._setFieldValue(module, "Y" + startNum, "image-alt");
      }
    }
    //optional
    this._setFieldValue(module, "Y" + (startNum + 3), "h5");
    this._setFieldValue(module, "Y" + (startNum + 4), "copy");
  }

  _setArrayModule(index) {
    let startNum = this.captionStartNums[index];
    let module = "module" + (index + 1);
    //console.log(" ");
    //console.log("_setArrayModule", "module:", module);
    this._setFieldValue(module, "BLANK", "moduleTypeARRAY");
    this._setFieldValue(module, "Y" + startNum, "headline");
    let colIDs = ["Y", "AC", "AG", "AK", "AN"];
    let obj = null;
    //get 'Alt Text' and 'Header row index
    let objIndicies = {};
    for (let i = startNum + 1, l = startNum + 4; i < l; i++) {
      obj = this._setFieldValue("check", "V" + i, "header");
      if (obj && obj.value === "Header") {
        objIndicies.header = i;
        obj = this._setFieldValue("check", "V" + (i - 1), "alt");
        if (obj && obj.value === "Alt Text") {
          objIndicies.alt = i - 1;
        }
        break;
      }
    }
    //console.log("_setArrayModule", "objIndicies:", objIndicies);
    for (let i = 0, l = colIDs.length; i < l; i++) {
      if (objIndicies.alt) {
        this._setFieldValue(
          module,
          colIDs[i] + objIndicies.alt,
          "image-alt",
          "ARRAY"
        );
      }
      this._setFieldValue(
        module,
        colIDs[i] + objIndicies.header,
        "h5",
        "ARRAY"
      );
      obj = this._setFieldValue(
        module,
        colIDs[i] + (objIndicies.header + 1),
        "copy",
        "ARRAY"
      );
      /* console.log(
        "_setArrayModule",
        i,
        ":",
        colIDs[i] + (objIndicies.header + 1),
        "obj:",
        obj
      ); */
    }
  }

  _setTableModule(index) {
    //let startNum = this.captionStartNums[index] + 3;
    let startNum = this.captionStartNums[index];
    let module = "module" + (index + 1);
    //console.log(" ");
    //console.log("_setTableModule ", "module:", module);
    this._setFieldValue(module, "BLANK", "moduleTypeTABLE");
    this._setFieldValue(module, "Y" + startNum, "headline");
    // module table
    let obj = null;
    //get 'Title' row index to find out index
    let objIndicies = {};
    for (let i = startNum + 1, l = startNum + 4; i < l; i++) {
      obj = this._setFieldValue("check", "V" + i, "title");
      //console.log("_setTableModule objIndicies", i, "obj:", obj);
      if (obj && obj.value === "Title") {
        objIndicies.title = i;
        obj = this._setFieldValue("check", "V" + (i - 1), "alt");
        if (obj && obj.value === "Alt Text") {
          objIndicies.alt = i - 1;
        }
        break;
      }
    }
    //console.log("_setTableModule ", "objIndicies:", objIndicies);
    const rows = 12; //maximal - we break if "Y" is empty
    let cols = 1;
    let colIDs = ["Y", "AC", "AE", "AG", "AI", "AK", "AM", "AN", "AO"];
    //get 'Title' row values to find out num cols
    for (let i = 1, l = colIDs.length; i < l; i++) {
      obj = this._setFieldValue(
        "check",
        colIDs[i] + objIndicies.title,
        "title"
      );
      /* console.log(
        "_setTableModule",
        "i:",
        i,
        "obj",
        obj,
        "ID:",
        colIDs[i] + objIndicies.title
      ); */
      if (!obj) {
        cols = i;
        break;
      }
    }
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        //logo case
        if (row === 0 && col === 0) {
          this._setFieldValue(module, "BLANK", row, "TABLE");
        } else {
          obj = this._setFieldValue(
            module,
            colIDs[col] + (objIndicies.title + row),
            row,
            "TABLE"
          );
          if (!obj) {
            if (col === 0) {
              row = 9999; //break outer loop too
              break;
            }
            this._setFieldValue(module, "BLANK", row, "TABLE");
          }
        }
        /* console.log(
          "_setTableModule",
          "setFieldValue:",
          col,
          row,
          colIDs[col] + (objIndicies.title + row)
        ); */
      }
    }
  }

  // overridden class member
  _parse() {
    //let subclasses override this protected member function
    console.log(
      "XLSXStdModuleParser extends XLSXParser - overridden method _parse"
    );
    //
    //get module start position via 'caption' field
    let cNum = 0;
    let obj = null;
    while (true) {
      obj = this._setFieldValue("check", "V" + cNum, "captions", "ARRAY");
      if (obj && obj.value === "Caption") {
        this.captionStartNums.push(cNum);
      }
      if (++cNum > 50) {
        break;
      }
    }
    console.log("_parse", "check", "captions", this.captionStartNums);

    //**** *NEW* **** every module could have ARRAY so we have to check
    for (let i = 0, l = this.captionStartNums.length; i < l; i++) {
      let type = this._getModuleType(i);
      switch (type) {
        case XLSXParser.MOD_TYPE_ARRAY:
          this._setArrayModule(i);
          break;
        case XLSXParser.MOD_TYPE_TABLE:
          this._setTableModule(i);
          break;
        default:
          this._setStdModule(i);
          break;
      }
    }
    //new for generic nunjuck templates
    this.addModules();
  }
}

module.exports.XLSXStdModuleParser = XLSXStdModuleParser;
