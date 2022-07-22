const { XLSXParser } = require("./XLSXParser");
/**
 * XLSX1144f6 XLSX-1-1-4-4-f-6.js
 * AUTHOR: J. Pfeifer (c) 2022
 * Created: 20.07.2022
 */
class XLSX1144f6 extends XLSXParser {
  /* constructor(template) {
    super(template);
    console.log("XLSX1144f6 constructor");
  } */

  _parse() {
    //let subclasses override this protected member function
    console.log("XLSX1144f6 extends XLSXParser - call protected method _parse");

    this._setFieldValue("module1", "Y4", "headline");
    this._setFieldValue("module1", "Y6", "image-alt");

    this._setFieldValue("module2", "Y12", "image-alt");
    this._setFieldValue("module2", "Y15", "copy");

    this._setFieldValue("module3", "Y18", "h4");
    this._setFieldValue("module3", "Y20", "headline", "ARRAY");
    this._setFieldValue("module3", "Y21", "copy", "ARRAY");
    this._setFieldValue("module3", "AC20", "headline", "ARRAY");
    this._setFieldValue("module3", "AC21", "copy", "ARRAY");
    this._setFieldValue("module3", "AG20", "headline", "ARRAY");
    this._setFieldValue("module3", "AG21", "copy", "ARRAY");
    this._setFieldValue("module3", "AK20", "headline", "ARRAY");
    this._setFieldValue("module3", "AK21", "copy", "ARRAY");

    this._setFieldValue("module4", "Y24", "h4");
    this._setFieldValue("module4", "BLANK", "headline", "ARRAY");
    this._setFieldValue("module4", "BLANK", "copy", "ARRAY");
    this._setFieldValue("module4", "AC26", "headline", "ARRAY");
    this._setFieldValue("module4", "AC27", "copy", "ARRAY");
    this._setFieldValue("module4", "AG26", "headline", "ARRAY");
    this._setFieldValue("module4", "AG27", "copy", "ARRAY");
    this._setFieldValue("module4", "AK26", "headline", "ARRAY");
    this._setFieldValue("module4", "AK27", "copy", "ARRAY");

    this._setFieldValue("module5", "Y30", "headline");

    this._setFieldValue("module5", "BLANK", 0, "TABLE");
    this._setFieldValue("module5", "AC32", 0, "TABLE");
    this._setFieldValue("module5", "AE32", 0, "TABLE");
    this._setFieldValue("module5", "AG32", 0, "TABLE");
    this._setFieldValue("module5", "AI32", 0, "TABLE");
    this._setFieldValue("module5", "AK32", 0, "TABLE");
    this._setFieldValue("module5", "AM32", 0, "TABLE");

    this._setFieldValue("module5", "Y33", 1, "TABLE");
    this._setFieldValue("module5", "AC33", 1, "TABLE");
    this._setFieldValue("module5", "AE33", 1, "TABLE");
    this._setFieldValue("module5", "AG33", 1, "TABLE");
    this._setFieldValue("module5", "AI33", 1, "TABLE");
    this._setFieldValue("module5", "AK33", 1, "TABLE");
    this._setFieldValue("module5", "AM33", 1, "TABLE");

    this._setFieldValue("module5", "Y34", 2, "TABLE");
    this._setFieldValue("module5", "BLANK", 2, "TABLE");
    this._setFieldValue("module5", "BLANK", 2, "TABLE");
    this._setFieldValue("module5", "AG34", 2, "TABLE");
    this._setFieldValue("module5", "BLANK", 2, "TABLE");
    this._setFieldValue("module5", "AK34", 2, "TABLE");
    this._setFieldValue("module5", "AM34", 2, "TABLE");

    this._setFieldValue("module5", "Y35", 3, "TABLE");
    this._setFieldValue("module5", "AC35", 3, "TABLE");
    this._setFieldValue("module5", "AE35", 3, "TABLE");
    this._setFieldValue("module5", "AG35", 3, "TABLE");
    this._setFieldValue("module5", "AI35", 3, "TABLE");
    this._setFieldValue("module5", "AK35", 3, "TABLE");
    this._setFieldValue("module5", "BLANK", 3, "TABLE");

    this._setFieldValue("module5", "Y36", 4, "TABLE");
    this._setFieldValue("module5", "AC36", 4, "TABLE");
    this._setFieldValue("module5", "BLANK", 4, "TABLE");
    this._setFieldValue("module5", "BLANK", 4, "TABLE");
    this._setFieldValue("module5", "BLANK", 4, "TABLE");
    this._setFieldValue("module5", "BLANK", 4, "TABLE");
    this._setFieldValue("module5", "BLANK", 4, "TABLE");

    this._setFieldValue("module5", "Y37", 5, "TABLE");
    this._setFieldValue("module5", "AC37", 5, "TABLE");
    this._setFieldValue("module5", "AE37", 5, "TABLE");
    this._setFieldValue("module5", "BLANK", 5, "TABLE");
    this._setFieldValue("module5", "BLANK", 5, "TABLE");
    this._setFieldValue("module5", "BLANK", 5, "TABLE");
    this._setFieldValue("module5", "BLANK", 5, "TABLE");

    this._setFieldValue("module5", "Y38", 6, "TABLE");
    this._setFieldValue("module5", "AC38", 6, "TABLE");
    this._setFieldValue("module5", "AE38", 6, "TABLE");
    this._setFieldValue("module5", "AG38", 6, "TABLE");
    this._setFieldValue("module5", "AI38", 6, "TABLE");
    this._setFieldValue("module5", "AK38", 6, "TABLE");
    this._setFieldValue("module5", "BLANK", 6, "TABLE");

    this._setFieldValue("module5", "Y39", 7, "TABLE");
    this._setFieldValue("module5", "AC39", 7, "TABLE");
    this._setFieldValue("module5", "AE39", 7, "TABLE");
    this._setFieldValue("module5", "AG39", 7, "TABLE");
    this._setFieldValue("module5", "AI39", 7, "TABLE");
    this._setFieldValue("module5", "AK39", 7, "TABLE");
    this._setFieldValue("module5", "AM39", 7, "TABLE");

    this._setFieldValue("module5", "Y40", 8, "TABLE");
    this._setFieldValue("module5", "AC40", 8, "TABLE");
    this._setFieldValue("module5", "AE40", 8, "TABLE");
    this._setFieldValue("module5", "AG40", 8, "TABLE");
    this._setFieldValue("module5", "BLANK", 8, "TABLE");
    this._setFieldValue("module5", "BLANK", 8, "TABLE");
    this._setFieldValue("module5", "AM40", 8, "TABLE");

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

module.exports.XLSX1144f6 = XLSX1144f6;