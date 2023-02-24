const { XLSXParser } = require("./XLSXParser");
/**
 * XLSXB1113f6 XLSX-B-1-1-1-3-f-6.js
 * AUTHOR: J. Pfeifer (c) 2022-2023
 * Created: 20.09.2022
 */
class XLSXB1113f6 extends XLSXParser {
  /* constructor(template) {
    super(template);
    console.log("XLSXB1113f6 constructor");
  } */

  _parse() {
    //let subclasses override this protected member function
    console.log("XLSXB1113f6 extends XLSXParser - call protected method _parse");
    // module1
    this._setFieldValue("module1", "Y4", "headline");
    this._setFieldValue("module1", "Y6", "image-alt");
    // module2
    this._setFieldValue("module2", "Y13", "image-alt");
    this._setFieldValue("module2", "Y15", "copy");
    // module3
    this._setFieldValue("module3", "Y20", "image-alt");
    //this._setFieldValue("module3", "Y22", "copy");
    // module4 
    //this._setFieldValue("module4", "Y27", "h4");
    this._setFieldValue("module4", "Y28", "image-alt", "ARRAY");
    this._setFieldValue("module4", "AC28", "image-alt", "ARRAY");
    this._setFieldValue("module4", "AG28", "image-alt", "ARRAY");
    this._setFieldValue("module4", "Y30", "copy", "ARRAY");
    this._setFieldValue("module4", "AC30", "copy", "ARRAY");
    this._setFieldValue("module4", "AG30", "copy", "ARRAY");
    // module5
    this._setFieldValue("module5", "Y33", "headline");
    // module5 table
    let index = 0;
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "AC36", index, "TABLE");
    this._setFieldValue("module5", "AE36", index, "TABLE");
    this._setFieldValue("module5", "AG36", index, "TABLE");
    this._setFieldValue("module5", "AI36", index, "TABLE");
    this._setFieldValue("module5", "AK36", index, "TABLE");
    this._setFieldValue("module5", "AM36", index, "TABLE");
    index++;
    this._setFieldValue("module5", "Y37", index, "TABLE");
    this._setFieldValue("module5", "AC37", index, "TABLE");
    this._setFieldValue("module5", "AE37", index, "TABLE");
    this._setFieldValue("module5", "AG37", index, "TABLE");
    this._setFieldValue("module5", "AI37", index, "TABLE");
    this._setFieldValue("module5", "AK37", index, "TABLE");
    this._setFieldValue("module5", "AM37", index, "TABLE");
    index++;
    this._setFieldValue("module5", "Y38", index, "TABLE");
    this._setFieldValue("module5", "AC38", index, "TABLE");
    this._setFieldValue("module5", "AE38", index, "TABLE");
    this._setFieldValue("module5", "AG38", index, "TABLE");
    this._setFieldValue("module5", "AI38", index, "TABLE");
    this._setFieldValue("module5", "AK38", index, "TABLE");
    this._setFieldValue("module5", "AM38", index, "TABLE");
    index++;
    this._setFieldValue("module5", "Y39", index, "TABLE");
    this._setFieldValue("module5", "AC39", index, "TABLE");
    this._setFieldValue("module5", "AE39", index, "TABLE");
    this._setFieldValue("module5", "AG39", index, "TABLE");
    this._setFieldValue("module5", "AI39", index, "TABLE");
    this._setFieldValue("module5", "AK39", index, "TABLE");
    this._setFieldValue("module5", "AM39", index, "TABLE");
    index++;
    this._setFieldValue("module5", "Y40", index, "TABLE");
    this._setFieldValue("module5", "AC40", index, "TABLE");
    this._setFieldValue("module5", "AE40", index, "TABLE");
    this._setFieldValue("module5", "AG40", index, "TABLE");
    this._setFieldValue("module5", "AI40", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    index++;
    this._setFieldValue("module5", "Y41", index, "TABLE");
    this._setFieldValue("module5", "AC41", index, "TABLE");
    this._setFieldValue("module5", "AE41", index, "TABLE");
    this._setFieldValue("module5", "AG41", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    index++;
    this._setFieldValue("module5", "Y42", index, "TABLE");
    this._setFieldValue("module5", "AC42", index, "TABLE");
    this._setFieldValue("module5", "AE42", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "AI42", index, "TABLE");
    this._setFieldValue("module5", "AK42", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE"); 
    index++;
    this._setFieldValue("module5", "Y43", index, "TABLE");
    this._setFieldValue("module5", "AC43", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE"); 
    index++;
    //
    /* this._setFieldValue("module5", "Y42", index, "TABLE");
    this._setFieldValue("module5", "AC42", index, "TABLE");
    this._setFieldValue("module5", "AE42", index, "TABLE");
    this._setFieldValue("module5", "AG42", index, "TABLE");
    this._setFieldValue("module5", "AI42", index, "TABLE");
    this._setFieldValue("module5", "AK42", index, "TABLE");
    this._setFieldValue("module5", "AM42", index, "TABLE");  */
  }
};

module.exports.XLSXB1113f6 = XLSXB1113f6;