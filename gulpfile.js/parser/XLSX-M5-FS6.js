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
    this._setFieldValue("module4", "Y26", "image-alt", "ARRAY");
    this._setFieldValue("module4", "AC26", "image-alt", "ARRAY");
    this._setFieldValue("module4", "AG26", "image-alt", "ARRAY");
    this._setFieldValue("module4", "AK26", "image-alt", "ARRAY");
    this._setFieldValue("module4", "Y27", "h5", "ARRAY");
    this._setFieldValue("module4", "AC27", "h5", "ARRAY");
    this._setFieldValue("module4", "AG27", "h5", "ARRAY");
    this._setFieldValue("module4", "AK27", "h5", "ARRAY");
    this._setFieldValue("module4", "Y28", "copy", "ARRAY");
    this._setFieldValue("module4", "AC28", "copy", "ARRAY");
    this._setFieldValue("module4", "AG28", "copy", "ARRAY");
    this._setFieldValue("module4", "AK28", "copy", "ARRAY");
    // *
    // module5
    this._setFieldValue("module5", "Y31", "headline");
    // module5 table
    let index = 0;
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "AC34", index, "TABLE");
    this._setFieldValue("module5", "AE34", index, "TABLE");
    this._setFieldValue("module5", "AG34", index, "TABLE");
    this._setFieldValue("module5", "AI34", index, "TABLE");
    this._setFieldValue("module5", "AK34", index, "TABLE");
    this._setFieldValue("module5", "AM34", index, "TABLE");
    index++;
    this._setFieldValue("module5", "Y35", index, "TABLE");
    this._setFieldValue("module5", "AC35", index, "TABLE");
    this._setFieldValue("module5", "AE35", index, "TABLE");
    this._setFieldValue("module5", "AG35", index, "TABLE");
    this._setFieldValue("module5", "AI35", index, "TABLE");
    this._setFieldValue("module5", "AK35", index, "TABLE");
    this._setFieldValue("module5", "AM35", index, "TABLE");
    index++;
    this._setFieldValue("module5", "Y36", index, "TABLE");
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
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    index++;
    this._setFieldValue("module5", "Y39", index, "TABLE");
    this._setFieldValue("module5", "AC39", index, "TABLE");
    this._setFieldValue("module5", "AE39", index, "TABLE");
    this._setFieldValue("module5", "AG39", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    index++;

    this._setFieldValue("module5", "Y40", index, "TABLE");
    this._setFieldValue("module5", "AC40", index, "TABLE");
    this._setFieldValue("module5", "AE40", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "AI40", index, "TABLE");
    this._setFieldValue("module5", "AK40", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    index++;
    this._setFieldValue("module5", "Y41", index, "TABLE");
    this._setFieldValue("module5", "AC41", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    this._setFieldValue("module5", "BLANK", index, "TABLE");
    /* index++;
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
    index++; */
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

module.exports.XLSXM5FS6 = XLSXM5FS6;