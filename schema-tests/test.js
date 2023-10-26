const Ajv = require("ajv").default;
const addFormats = require("ajv-formats");
const localize = require("ajv-i18n");
const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
require("ajv-errors")(ajv);
addFormats(ajv);

// 自定义format
ajv.addFormat("isLaLa", (data) => {
  return data === "lala";
});
// 自定义关键字
ajv.addKeyword({
  keyword: "range",
  validate: function fun(schema, data) {
    console.log(schema, data); // schema:是关键字后面的值，data:是要校验的值
    fun.errors = [
      {
        keyword: "range",
        message: `值必须在[${schema}]之间`,
        params: { keyword: "range" },
      },
    ];
    return data > schema[0] && data < schema[1];
  },
});
// ajv.addKeyword({
//   keyword: "range",
//   validate: (schema, data) => {
//     // schema:是关键字后面的值，data:是要校验的值
//     return data >= schema[0] && data <= schema[1];
//   },
// });
const schema = {
  type: "object",
  properties: {
    foo: { type: "integer" },
    age: {
      type: "number",
      minimum: 2,
      errorMessage: {
        type: "类型应该是number",
        minimum: "最小值是2",
      },
    },
    pets: {
      type: "array",
      items: { type: "string", maxLength: 3 },
    },
    isWorker: { type: "boolean" },
    email: { type: "string", format: "email" },
    name: { type: "string", format: "isLaLa" },
    ageRange: { type: "number", range: [1, 10] },
  },
  required: ["foo"],
  additionalProperties: false,
  errorMessage: {
    type: "必须是一个对象",
    properties: {
      foo: "foo必传",
      age: "错误",
    },
  },
};

const validate = ajv.compile(schema);

const data = {
  foo: 1,
  age: 1,
  pets: ["mini", 2],
  isWorker: true,
  email: "1337312569@qq.com",
  name: "lala",
  ageRange: 0,
};

const valid = validate(data);
if (!valid) {
  console.log(validate.errors);
  // localize.zh(validate.errors);
  // console.log(ajv.errorsText(validate.errors, { separator: "\n" }));
}
