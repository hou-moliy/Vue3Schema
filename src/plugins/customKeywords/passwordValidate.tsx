import { CustomKeyword } from "../../../lib/types";
const keyword: CustomKeyword = {
  name: "_passwordValidate", // _的前缀表示是自定义关键字
  deinition: {
    macro: (schema, parentSchema, it) => {
      return {
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])", // 密码必须包含大小写字母、数字、特殊字符
      };
    },
  },
  transformSchema: (schema) => {
    return {
      ...schema,
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])",
    };
  },
};

export default keyword;
