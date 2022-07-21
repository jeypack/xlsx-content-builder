const { XLSXParser } = require("./XLSXParser");
/**
 * XLSX1441f4 XLSX-1-4-4-1-f-3.js
 * AUTHOR: J. Pfeifer (c) 2022
 * Created: 20.07.2022
 */
class XLSX1441f4 extends XLSXParser {
  /* constructor(template) {
    super(template);
    console.log("XLSX1441f3 constructor");
  } */

  _parse() {
    //let subclasses override this protected member function
    console.log("XLSX1441f43 extends XLSXParser - call protected method _parse");

    this._setFieldValue("module1", "Y4", "headline");
    this._setFieldValue("module1", "Y6", "image-alt");

    this._setFieldValue("module2", "Y14", "headline", "ARRAY");
    this._setFieldValue("module2", "Y15", "copy", "ARRAY");
    this._setFieldValue("module2", "AC14", "headline", "ARRAY");
    this._setFieldValue("module2", "AC15", "copy", "ARRAY");
    this._setFieldValue("module2", "AG14", "headline", "ARRAY");
    this._setFieldValue("module2", "AG15", "copy", "ARRAY");
    this._setFieldValue("module2", "AK14", "headline", "ARRAY");
    this._setFieldValue("module2", "AK15", "copy", "ARRAY");

    this._setFieldValue("module3", "Y21", "headline", "ARRAY");
    //this._setFieldValue("module3", "Y22", "copy", "ARRAY", "\n\n");
    this._setFieldValue("module3", "Y22", "copy", "ARRAY");
    this._setFieldValue("module3", "AC21", "headline", "ARRAY");
    this._setFieldValue("module3", "AC22", "copy", "ARRAY");
    this._setFieldValue("module3", "AG21", "headline", "ARRAY");
    //this._setFieldValue("module3", "AG22", "copy", "ARRAY", "\n\n");
    this._setFieldValue("module3", "AG22", "copy", "ARRAY");
    this._setFieldValue("module3", "AK21", "headline", "ARRAY");
    this._setFieldValue("module3", "AK22", "copy", "ARRAY");

    this._setFieldValue("module4", "Y27", "image-alt");

    this._setFieldValue("module5", "Y33", "headline");

    this._setFieldValue("module5", "BLANK", 0, "TABLE");
    this._setFieldValue("module5", "AC36", 0, "TABLE");
    this._setFieldValue("module5", "AE36", 0, "TABLE");
    this._setFieldValue("module5", "AG36", 0, "TABLE");

    this._setFieldValue("module5", "Y37", 1, "TABLE");
    this._setFieldValue("module5", "AC37", 1, "TABLE");
    this._setFieldValue("module5", "AE37", 1, "TABLE");
    this._setFieldValue("module5", "AG37", 1, "TABLE");

    this._setFieldValue("module5", "Y38", 2, "TABLE");
    this._setFieldValue("module5", "AC38", 2, "TABLE");
    this._setFieldValue("module5", "AE38", 2, "TABLE");
    this._setFieldValue("module5", "AG38", 2, "TABLE");

    this._setFieldValue("module5", "Y39", 3, "TABLE");
    this._setFieldValue("module5", "AC39", 3, "TABLE");
    this._setFieldValue("module5", "AE39", 3, "TABLE");
    this._setFieldValue("module5", "AG39", 3, "TABLE");

    this._setFieldValue("module5", "Y40", 4, "TABLE");
    this._setFieldValue("module5", "AC40", 4, "TABLE");
    this._setFieldValue("module5", "AE40", 4, "TABLE");
    this._setFieldValue("module5", "AG40", 4, "TABLE");

    this._setFieldValue("module5", "Y41", 5, "TABLE");
    this._setFieldValue("module5", "AC41", 5, "TABLE");
    this._setFieldValue("module5", "AE41", 5, "TABLE");
    this._setFieldValue("module5", "AG41", 5, "TABLE");

    this._setFieldValue("module5", "Y42", 6, "TABLE");
    this._setFieldValue("module5", "BLANK", 6, "TABLE");
    this._setFieldValue("module5", "BLANK", 6, "TABLE");
    this._setFieldValue("module5", "AG42", 6, "TABLE");

    this._setFieldValue("module5", "Y43", 7, "TABLE");
    this._setFieldValue("module5", "BLANK", 7, "TABLE");
    this._setFieldValue("module5", "AE43", 7, "TABLE");
    this._setFieldValue("module5", "AG43", 7, "TABLE");

    this._setFieldValue("module5", "Y44", 8, "TABLE");
    this._setFieldValue("module5", "AC44", 8, "TABLE");
    this._setFieldValue("module5", "BLANK", 8, "TABLE");
    this._setFieldValue("module5", "AG44", 8, "TABLE");
  }
};

module.exports.XLSX1441f4 = XLSX1441f4;