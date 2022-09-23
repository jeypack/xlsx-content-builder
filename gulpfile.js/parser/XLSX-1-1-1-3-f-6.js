const { XLSXParser } = require("./XLSXParser");
/**
 * XLSX1113f6 XLSX-1-1-1-3-f-6.js
 * AUTHOR: J. Pfeifer (c) 2022
 * Created: 20.09.2022
 */
class XLSX1113f6 extends XLSXParser {
  /* constructor(template) {
    super(template);
    console.log("XLSX1113f6 constructor");
  } */

  _parse() {
    //let subclasses override this protected member function
    console.log("XLSX1113f6 extends XLSXParser - call protected method _parse");
    // module1
    this._setFieldValue("module1", "Y4", "headline");
    this._setFieldValue("module1", "Y6", "image-alt");
    // module2
    this._setFieldValue("module2", "Y13", "image-alt");
    // module3
    this._setFieldValue("module3", "Y20", "image-alt");
    this._setFieldValue("module3", "Y22", "copy");
    // module4
    this._setFieldValue("module4", "Y25", "h4");
    this._setFieldValue("module4", "Y28", "copy", "ARRAY");
    this._setFieldValue("module4", "AC28", "copy", "ARRAY");
    this._setFieldValue("module4", "AG28", "copy", "ARRAY");
    // module5
    this._setFieldValue("module5", "Y31", "headline");
    // module5 table
    this._setFieldValue("module5", "BLANK", 0, "TABLE");
    this._setFieldValue("module5", "AC33", 0, "TABLE");
    this._setFieldValue("module5", "AE33", 0, "TABLE");
    this._setFieldValue("module5", "AG33", 0, "TABLE");
    this._setFieldValue("module5", "AI33", 0, "TABLE");
    this._setFieldValue("module5", "AK33", 0, "TABLE");
    this._setFieldValue("module5", "AM33", 0, "TABLE");

    this._setFieldValue("module5", "Y34", 1, "TABLE");
    this._setFieldValue("module5", "AC34", 1, "TABLE");
    this._setFieldValue("module5", "AE34", 1, "TABLE");
    this._setFieldValue("module5", "AG34", 1, "TABLE");
    this._setFieldValue("module5", "AI34", 1, "TABLE");
    this._setFieldValue("module5", "AK34", 1, "TABLE");
    this._setFieldValue("module5", "AM34", 1, "TABLE");

    this._setFieldValue("module5", "Y35", 2, "TABLE");
    this._setFieldValue("module5", "BLANK", 2, "TABLE");
    this._setFieldValue("module5", "BLANK", 2, "TABLE");
    this._setFieldValue("module5", "AG35", 2, "TABLE");
    this._setFieldValue("module5", "BLANK", 2, "TABLE");
    this._setFieldValue("module5", "AK35", 2, "TABLE");
    this._setFieldValue("module5", "AM35", 2, "TABLE");

    this._setFieldValue("module5", "Y36", 3, "TABLE");
    this._setFieldValue("module5", "AC36", 3, "TABLE");
    this._setFieldValue("module5", "AE36", 3, "TABLE");
    this._setFieldValue("module5", "AG36", 3, "TABLE");
    this._setFieldValue("module5", "AI36", 3, "TABLE");
    this._setFieldValue("module5", "AK36", 3, "TABLE");
    this._setFieldValue("module5", "BLANK", 3, "TABLE");

    this._setFieldValue("module5", "Y37", 4, "TABLE");
    this._setFieldValue("module5", "AC37", 4, "TABLE");
    this._setFieldValue("module5", "BLANK", 4, "TABLE");
    this._setFieldValue("module5", "BLANK", 4, "TABLE");
    this._setFieldValue("module5", "BLANK", 4, "TABLE");
    this._setFieldValue("module5", "BLANK", 4, "TABLE");
    this._setFieldValue("module5", "BLANK", 4, "TABLE");

    this._setFieldValue("module5", "Y38", 5, "TABLE");
    this._setFieldValue("module5", "AC38", 5, "TABLE");
    this._setFieldValue("module5", "AE38", 5, "TABLE");
    this._setFieldValue("module5", "BLANK", 5, "TABLE");
    this._setFieldValue("module5", "BLANK", 5, "TABLE");
    this._setFieldValue("module5", "BLANK", 5, "TABLE");
    this._setFieldValue("module5", "BLANK", 5, "TABLE");

    this._setFieldValue("module5", "Y39", 6, "TABLE");
    this._setFieldValue("module5", "AC39", 6, "TABLE");
    this._setFieldValue("module5", "AE39", 6, "TABLE");
    this._setFieldValue("module5", "AG39", 6, "TABLE");
    this._setFieldValue("module5", "AI39", 6, "TABLE");
    this._setFieldValue("module5", "AK39", 6, "TABLE");
    this._setFieldValue("module5", "BLANK", 6, "TABLE");

    this._setFieldValue("module5", "Y40", 7, "TABLE");
    this._setFieldValue("module5", "AC40", 7, "TABLE");
    this._setFieldValue("module5", "AE40", 7, "TABLE");
    this._setFieldValue("module5", "AG40", 7, "TABLE");
    this._setFieldValue("module5", "AI40", 7, "TABLE");
    this._setFieldValue("module5", "AK40", 7, "TABLE");
    this._setFieldValue("module5", "AM40", 7, "TABLE");

    this._setFieldValue("module5", "Y41", 8, "TABLE");
    this._setFieldValue("module5", "AC41", 8, "TABLE");
    this._setFieldValue("module5", "AE41", 8, "TABLE");
    this._setFieldValue("module5", "AG41", 8, "TABLE");
    this._setFieldValue("module5", "BLANK", 8, "TABLE");
    this._setFieldValue("module5", "BLANK", 8, "TABLE");
    this._setFieldValue("module5", "AM41", 8, "TABLE");

    /*
    this._setFieldValue("module5", "Y42", 9, "TABLE");
    this._setFieldValue("module5", "AC42", 9, "TABLE");
    this._setFieldValue("module5", "AE42", 9, "TABLE");
    this._setFieldValue("module5", "AG42", 9, "TABLE");
    this._setFieldValue("module5", "AI42", 9, "TABLE");
    this._setFieldValue("module5", "AK42", 9, "TABLE");
    this._setFieldValue("module5", "AM42", 9, "TABLE"); 
    */

  }
};

module.exports.XLSX1113f6 = XLSX1113f6;