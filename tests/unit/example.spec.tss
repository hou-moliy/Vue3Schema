import { defineComponent, h } from "vue";
import { shallowMount } from "@vue/test-utils";
const HelloWorld = defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup(props) {
    return () => {
      return h("div", props.msg);
    };
  },
});
beforeEach(() => {
  // 每个it测试用例执行前都会执行
  console.log("beforeEach");
});

afterEach(() => {
  // 每个it测试用例执行后都会执行
  console.log("afterEach");
});
beforeAll(() => {
  // 所有测试用例执行前都会执行
  console.log("beforeAll");
});
afterAll(() => {
  // 所有测试用例执行后都会执行
  console.log("afterAll");
});

describe("HelloWorld.vue", () => {
  beforeEach(() => {
    // 每个it测试用例执行前都会执行
    console.log("beforeEach HelloWorld");
  });

  afterEach(() => {
    // 每个it测试用例执行后都会执行
    console.log("afterEach HelloWorld");
  });
  beforeAll(() => {
    // 所有测试用例执行前都会执行
    console.log("beforeAll HelloWorld");
  });
  afterAll(() => {
    // 所有测试用例执行后都会执行
    console.log("afterAll HelloWorld");
  });
  it("renders props.msg when passed", (done) => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
    setTimeout(() => {
      expect(1 + 2).toBe(3);
      done();
    }, 1000);
  });
  it("async", async () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
    await wrapper.setProps({
      msg: "更新了的值",
    });
    expect(wrapper.text()).toMatch("更新了的值");
  });
  it("should work", () => {
    expect(1 + 1).toBe(2);
    return new Promise((resolve) => {
      // setTimeout(() => {
      expect(1 + 2).toBe(3);
      resolve("ok");
      // }, 1000);
    });
  });
  // test() 和 it() 是一样的 用哪个都行 test() 是 jest 提供的 it() 是 mocha 提供的
  // describe() 用来分组 一个 describe() 里面可以有多个 it() 或者 test()
  // describe() 里面也可以有多个 describe() 形成多层级的分组
  // describe() 里面可以写钩子函数
  test("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    }); // shallowMount() 浅渲染 也就是只渲染当前组件 不渲染子组件
    expect(wrapper.text()).toMatch(msg);
    // text() 获取元素的文本内容 toMatch() 匹配正则，或者字符串，
    // toBe() 匹配基本类型 toEqual() 匹配引用类型 toStrictEqual() 匹配严格相等
    // toContain() 匹配数组或者字符串中是否包含某个元素 toHaveLength() 匹配数组或者字符串的长度
    // toHaveProperty() 匹配对象是否包含某个属性
    // .not.toBe() 取反 不匹配这个值就通过 其他api同理
  });
});

describe("another", () => {
  beforeEach(() => {
    // 每个it测试用例执行前都会执行
    console.log("beforeEach another");
  });

  afterEach(() => {
    // 每个it测试用例执行后都会执行
    console.log("afterEach another");
  });
  beforeAll(() => {
    // 所有测试用例执行前都会执行
    console.log("beforeAll another");
  });
  afterAll(() => {
    // 所有测试用例执行后都会执行
    console.log("afterAll another");
  });
  it("should work", () => {
    expect(1 + 1).toBe(2);
  });
});
