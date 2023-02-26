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
    //get module start position via 'caption' field
    let captionStartNums = [];
    let cNum = 0;
    let obj = null;
    while (true) {
      obj = this._setFieldValue("modules", "V" + cNum, "captions", "ARRAY");
      if (obj && obj.value === "Caption") {
        captionStartNums.push(cNum);
      }
      if (++cNum > 50) {
        break;
      }
    }
    console.log("_parse", "modules", "captions", captionStartNums);

    // *
    // module1 - 3
    for (let i = 0, l = 3; i < l; i++) {
      //set module
      let c = captionStartNums[i];
      //let m = "module" + (c + 1);
      let m = "module" + (i + 1);
      console.log("_parse", "module", "m", m);
      this._setFieldValue(m, "Y" + c, "headline");
      obj = this._setFieldValue(m, "Y" + (c + 2), "image-alt");
      if (!obj) {
        obj = this._setFieldValue(m, "Y" + (c + 1), "image-alt");
        if (!obj) {
          obj = this._setFieldValue(m, "Y" + c, "image-alt");
        }
      }
      //optional
      this._setFieldValue(m, "Y" + (c + 3), "h5");
      this._setFieldValue(m, "Y" + (c + 4), "copy");
    }

    // *
    // module4
    //if this description is empty we could break
    //but for now we leave this as it is: try to get possible values
    //obj = this._setFieldValue("module4", "Y28", "copy", "ARRAY");
    let startNum = captionStartNums[3];
    /* for (let i = startNum, l = startNum + 5; i < l; i++) {
      obj = this._setFieldValue("module4", "V" + i, "caption");
      console.log("_parse", "i:", i, "obj:", obj);
      if (obj && obj.value === "Caption") {
        startNum = i;
        break;
      }
    } */

    this._setFieldValue("module4", "Y" + startNum, "headline");
    console.log("_parse", "startNum:", startNum, "startNum + 2:", startNum + 2);
    let colIDs = ["AC", "AG", "AK", "AN"];
    for (let i = 0, l = colIDs.length; i < l; i++) {
      this._setFieldValue(
        "module4",
        colIDs[i] + (startNum + 2),
        "image-alt",
        "ARRAY"
      );
      this._setFieldValue("module4", colIDs[i] + (startNum + 3), "h5", "ARRAY");
      this._setFieldValue(
        "module4",
        colIDs[i] + (startNum + 4),
        "copy",
        "ARRAY"
      );
    }

    /* this._setFieldValue("module4", "Y26", "image-alt", "ARRAY");
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
    this._setFieldValue("module4", "AN28", "copy", "ARRAY"); */

    // *
    // module5
    startNum = captionStartNums[4] + 3;
    this._setFieldValue("module5", "Y" + (startNum - 3), "headline");
    // module5 table
    const rows = 12; //maximal - we break if "Y" is empty
    const cols = 7;
    colIDs = ["Y", "AC", "AE", "AG", "AI", "AK", "AM"];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        //logo case
        if (row === 0 && col === 0) {
          this._setFieldValue("module5", "BLANK", row, "TABLE");
        } else {
          obj = this._setFieldValue(
            "module5",
            colIDs[col] + (startNum + row),
            row,
            "TABLE"
          );
          if (!obj) {
            if (col === 0) {
              row = 9999;
              break;
            }
            this._setFieldValue("module5", "BLANK", row, "TABLE");
          }
        }
        console.log(
          "_parse",
          "setFieldValue:",
          col,
          row,
          colIDs[col] + (startNum + row)
        );
      }
    }
  }
}

module.exports.XLSXM5FS6 = XLSXM5FS6;
