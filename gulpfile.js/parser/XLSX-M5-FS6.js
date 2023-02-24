const { XLSXParser } = require("./XLSXParser");
/**
 * XLSXM5FS6 XLSX-M5-FS6.js
 * AUTHOR: J. Pfeifer (c) 2022-2023
 * Created: 20.09.2022
 */
class XLSXM5FS6 extends XLSXParser {
  /* constructor(template) {
    super(template);
    console.log("XLSXM5FS6 constructor");
  } */

  _parse() {
    //let subclasses override this protected member function
    console.log("XLSXM5FS6 extends XLSXParser - call protected method _parse");
    // *
    // module1
    this._setFieldValue("module1", "Y4", "headline");
    let obj = this._setFieldValue("module1", "Y6", "image-alt");
    if (!obj) {
      this._setFieldValue("module1", "Y5", "image-alt");
    }
    // *
    // module2
    obj = this._setFieldValue("module1", "Y13", "image-alt");
    if (!obj) {
      this._setFieldValue("module2", "Y12", "image-alt");
    }
    //optional
    this._setFieldValue("module2", "Y15", "copy");
    // *
    // module3
    obj = this._setFieldValue("module1", "Y20", "image-alt");
    if (!obj) {
      this._setFieldValue("module2", "Y19", "image-alt");
    }
    //optional
    this._setFieldValue("module3", "Y22", "copy");
    // *
    // module4
    //if this description is empty we could break
    //but for now we leave this as it is: try to get possible values
    //obj = this._setFieldValue("module4", "Y28", "copy", "ARRAY");
    this._setFieldValue("module4", "Y26", "image-alt", "ARRAY");
    this._setFieldValue("module4", "AC26", "image-alt", "ARRAY");
    this._setFieldValue("module4", "AG26", "image-alt", "ARRAY");
    this._setFieldValue("module4", "AK26", "image-alt", "ARRAY");
    this._setFieldValue("module4", "AN26", "image-alt", "ARRAY");
    this._setFieldValue("module4", "Y27", "h5", "ARRAY");
    this._setFieldValue("module4", "AC27", "h5", "ARRAY");
    this._setFieldValue("module4", "AG27", "h5", "ARRAY");
    this._setFieldValue("module4", "AK27", "h5", "ARRAY");
    this._setFieldValue("module4", "AN27", "h5", "ARRAY");
    this._setFieldValue("module4", "Y28", "copy", "ARRAY");
    this._setFieldValue("module4", "AC28", "copy", "ARRAY");
    this._setFieldValue("module4", "AG28", "copy", "ARRAY");
    this._setFieldValue("module4", "AK28", "copy", "ARRAY");
    this._setFieldValue("module4", "AN28", "copy", "ARRAY");
    // *
    // module5
    this._setFieldValue("module5", "Y31", "headline");
    // module5 table
    const rows = 12; //maximal - we break if "Y" is empty
    const cols = 7;
    const colIDs = ["Y", "AC", "AE", "AG", "AI", "AK", "AM"];
    const startNum = 34;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        //logo case
        if (row === 0 && col === 0) {
          this._setFieldValue("module5", "BLANK", row, "TABLE");
        } else {
          obj = this._setFieldValue("module5", colIDs[col] + (startNum + row), row, "TABLE");
          if (!obj) {
            if (col === 0) {
              row = 9999;
              break;
            }
            this._setFieldValue("module5", "BLANK", row, "TABLE");
          }
        }
        console.log("_parse", "setFieldValue:", col, row, colIDs[col] + (startNum + row));
      }
    }
  }
};

module.exports.XLSXM5FS6 = XLSXM5FS6;