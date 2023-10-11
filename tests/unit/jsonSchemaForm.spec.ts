import { mount } from "@vue/test-utils";
import JsonSchemaForm, { NumberField } from "../../lib";

describe("JsonSchemaForm", () => {
  it("正常渲染一个数字的输入框", (done) => {
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema: {
          type: "number",
        },
        value: "",
        onChange: () => {},
      },
    });
    const numberField = wrapper.findComponent(NumberField);
    expect(numberField.exists()).toBeTruthy(); // 断言 numberField 组件存在
    done();
  });
});
