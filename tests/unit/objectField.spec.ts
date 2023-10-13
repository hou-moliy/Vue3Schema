import { mount } from "@vue/test-utils";
import JsonSchemaForm, { NumberField, StringField } from "../../lib";

describe("objectField", () => {
  let schema: any;
  let wrapper: any;
  let value: any = {};
  let strField: any, numField: any;
  beforeEach(() => {
    // 每个测试用例执行前都会执行，执行多次
    schema = {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        age: {
          type: "number",
        },
      },
    };
    wrapper = mount(JsonSchemaForm, {
      props: {
        schema,
        value,
        onChange: (v) => {
          value = v;
        },
      },
    });
    strField = wrapper.findComponent(StringField);
    numField = wrapper.findComponent(NumberField);
  });
  it("正常渲染一个objectField", (done) => {
    expect(strField.exists()).toBeTruthy();
    expect(numField.exists()).toBeTruthy();
    done();
  });
  it("正常操作objectField的数据", (done) => {
    const strField = wrapper.findComponent(StringField);
    const numField = wrapper.findComponent(NumberField);
    strField.props("onChange")("123");
    numField.props("onChange")(456);
    expect(value.name).toBe("123");
    expect(value.age).toBe(456);
    done();
  });
  it("value是undefined", (done) => {
    value = {
      name: "hyz",
    };
    strField.props("onChange")(undefined);
    // 判断name是否被删除
    expect(value.name).toBeUndefined();
    done();
  });
  it("value不是Object", (done) => {
    value = "123";
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema,
        value,
        onChange: (v) => {
          value = v;
        },
      },
    });
    strField = wrapper.findComponent(StringField);
    numField = wrapper.findComponent(NumberField);
    strField.props("onChange")("456");
    expect(value.name).toBe("456");
    expect(value.age).not.toBe("456");
    done();
  });
  it("schema.properties 是 undefined", (done) => {
    delete schema.properties;
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema,
        value,
        onChange: (v) => {
          value = v;
        },
      },
    });
    expect(wrapper.findComponent(StringField).exists()).toBeFalsy(); // 不存在
    expect(wrapper.findComponent(NumberField).exists()).toBeFalsy(); // 不存在
    done();
  });
});
