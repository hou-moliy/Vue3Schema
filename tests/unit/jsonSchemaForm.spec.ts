import { mount } from "@vue/test-utils";
import JsonSchemaForm, { NumberField } from "../../lib";

describe("JsonSchemaForm", () => {
  it("正常渲染一个数字的输入框", (done) => {
    let val = "";
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema: {
          type: "number",
        },
        value: val,
        onChange: (v) => {
          val = v;
        },
      },
    });
    const numberField = wrapper.findComponent(NumberField);
    expect(numberField.exists()).toBeTruthy(); // 断言 numberField 组件存在
    /**
     * 触发 numberField 组件的 onChange 事件
     * 不关注 onChange 事件的实现细节，只关注 onChange 事件的结果，一般第三方插件的测试都是这样的
     * 但是自己写的组件，一般都是关注 onChange 事件的实现细节
     */
    numberField.props("onChange")("123"); // 触发 numberField 组件的 onChange 事件
    // 为什么是 "123" 而不是 123 呢？因为我们的 onChange 事件的实现是 val = v，v 是字符串，所以 val 也是字符串
    expect(val).toBe("123"); // 断言 val 的值为 "123"
    /**
     * 通过 find 找到 numberField 组件下的 input 元素
     * 通过 input.element.value 修改 input 的值
     * 通过 input.trigger("input") 触发 input 的 input 事件
     * 通过 expect 断言 val 的值为 123
     * 重点是：我们要关注组件内部的实现，我们即使是输入"123"，也要保证 val 的值为 123 而不是 "123"
     * 一定值时Number类型,保证组件正确性
     */
    const input = numberField.find("input");
    input.element.value = "123"; // 修改 input 的值
    input.trigger("input");
    expect(val).toBe(123); // 断言 val 的值为 123
    done();
  });
});
