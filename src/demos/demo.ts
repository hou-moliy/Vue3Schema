import PasswordWidget from "@/components/Custom/PasswordWidget";
export default {
  name: "Demo",
  schema: {
    type: "object",
    properties: {
      pass1: {
        type: "string",
        minLength: 10,
        title: "password",
      },
      pass2: {
        type: "string",
        minLength: 10,
        title: "re try password",
      },
    },
  },
  async customValidate(data: any, errors: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 都是必填项
        if (!data.pass1) {
          errors.pass1.addError("必填");
        }
        if (!data.pass2) {
          errors.pass2.addError("必填");
        }
        if (data.pass1 !== data.pass2) {
          errors.pass2.addError("密码必须相同");
        }
        resolve("");
      }, 2000);
    });
  },
  uiSchema: {
    properties: {
      pass1: {
        widget: PasswordWidget,
      },
    },
  },
  default: {
    pass1: "1234567890",
  },
};
