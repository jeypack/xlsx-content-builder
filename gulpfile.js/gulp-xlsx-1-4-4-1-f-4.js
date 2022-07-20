/**
 * GULP XLSX 1-4-4-1-f-4
 * AUTHOR: J. Pfeifer (c) 2022
 */

const { setFieldValue } = require("./gulp-xlsx-helper.js");

module.exports.parse = () => {
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

  setFieldValue("module5", "BLANK", 0, "TABLE");
  setFieldValue("module5", "AC36", 0, "TABLE");
  setFieldValue("module5", "AE36", 0, "TABLE");
  setFieldValue("module5", "AG36", 0, "TABLE");
  setFieldValue("module5", "AI36", 0, "TABLE");

  setFieldValue("module5", "Y37", 1, "TABLE");
  setFieldValue("module5", "AC37", 1, "TABLE");
  setFieldValue("module5", "AE37", 1, "TABLE");
  setFieldValue("module5", "AG37", 1, "TABLE");
  setFieldValue("module5", "AI37", 1, "TABLE");

  setFieldValue("module5", "Y38", 2, "TABLE");
  setFieldValue("module5", "AC38", 2, "TABLE");
  setFieldValue("module5", "AE38", 2, "TABLE");
  setFieldValue("module5", "AG38", 2, "TABLE");
  setFieldValue("module5", "BLANK", 2, "TABLE");

  setFieldValue("module5", "Y39", 3, "TABLE");
  setFieldValue("module5", "BLANK", 3, "TABLE");
  setFieldValue("module5", "AE39", 3, "TABLE");
  setFieldValue("module5", "BLANK", 3, "TABLE");
  setFieldValue("module5", "BLANK", 3, "TABLE");

  setFieldValue("module5", "Y40", 4, "TABLE");
  setFieldValue("module5", "AC40", 4, "TABLE");
  setFieldValue("module5", "AE40", 4, "TABLE");
  setFieldValue("module5", "AG40", 4, "TABLE");
  setFieldValue("module5", "AI40", 4, "TABLE");

  setFieldValue("module5", "Y41", 5, "TABLE");
  setFieldValue("module5", "BLANK", 5, "TABLE");
  setFieldValue("module5", "AE41", 5, "TABLE");
  setFieldValue("module5", "BLANK", 5, "TABLE");
  setFieldValue("module5", "BLANK", 5, "TABLE");

  setFieldValue("module5", "Y42", 6, "TABLE");
  setFieldValue("module5", "BLANK", 6, "TABLE");
  setFieldValue("module5", "AE42", 6, "TABLE");
  setFieldValue("module5", "BLANK", 6, "TABLE");
  setFieldValue("module5", "BLANK", 6, "TABLE");
};
