# vue3-cli-ts(vue+ts 打造企业级组件库学习)

## 2

### 2-5

#### h 函数

```js
import { createApp, defineComponent, h } from "vue";
// import App from "./App.vue";
import router from "./router";
import HelloWorld from "./components/HelloWorld.vue";
const App = defineComponent({
  render() {
    return h("div", { id: "app" }, [
      h("img", {
        alt: "Vue logo",
        src: "https://vuejs.org/images/logo.png",
      }),
      h(HelloWorld, { msg: "Hello Vue 3 + TypeScript + Vite", age: 18 }),
    ]);
  },
});
createApp(App).use(router).mount("#app");

/**
 * h(标签名，标签属性，标签内的子标签（多个就是[],文字就是""）)
 */
```

### 2-6\7

#### setup 的运用和其意义

##### setup 返回 render 函数的用法

```js
import { createApp, defineComponent, h, reactive, ref } from "vue";
// import App from "./App.vue";
import router from "./router";
import HelloWorld from "./components/HelloWorld.vue";
const App = defineComponent({
  setup() {
    const state = reactive({
      name: "hy",
      age: 20,
    });
    setInterval(() => {
      state.age++;
      state.name = "hy" + state.age;
      numberRef.value += 1;
    }, 1000);
    const numberRef = ref(1);

    // const number = numberRef.value; // 这样做number的值永远都是1，不会更新，因为setup只会执行一次，值的改变不会触发setup的再次执行，但是会触发render的执行，所以需要放到下面
    return () => {
      const number = numberRef.value;
      return h("div", { id: "app" }, [
        h("img", {
          alt: "Vue logo",
          src: "https://vuejs.org/images/logo.png",
        }),
        h(HelloWorld, { msg: state.name, age: state.age }),
        h("p", number),
      ]);
    };
  },
});
createApp(App).use(router).mount("#app");
```

### 2-8

#### JSX

##### [vue3.0 使用 jsx 就用 babel-plugin-jsx](https://github.com/vuejs/babel-plugin-jsx/blob/main/packages/babel-plugin-jsx/README-zh_CN.md)

```js
import { defineComponent, reactive } from "vue";
import HelloWorld from "./components/HelloWorld.vue";

export default defineComponent({
  setup() {
    const state = reactive({
      name: "hy",
      age: 20,
    });
    // setInterval(() => {
    //   state.age++;
    //   state.name = "hy" + state.age;
    // }, 1000);
    const renderHelloWorld = (msg: string, age: number) => {
      return <HelloWorld msg={msg} age={age} />;
    };
    return () => {
      return (
        <div id="app">
          <input type="text" v-model={state.name} />
          <img alt="Vue logo" src="https://vuejs.org/images/logo.png" />
          {renderHelloWorld(state.name, state.age)}
        </div>
      );
    };
  },
});
```

## 3

### 3-1

#### 什么是 json schema

- json 数据
- 校验数据

#### 如何使用 ajv 来定义和校验 jsonSchema

- [ajv-v6^](https://ajv.js.org/guide/getting-started.html)
- [jsonSchema-v4^](http://json-schema.org/obsolete-implementations)
- [自定义 format(ajv 库支持的)](https://github.com/ajv-validator/ajv/blob/master/docs/api.md#api-addformat)
  示例代码

```js
// 参考schema-tests文件夹下的test.js文件;
```

#### 如何自定义关键字

[自定义关键字](https://ajv.js.org/keywords.html)

#### 如何转换错误语言，自定义关键字如何定义错误信息

- [转换错误语言只支持原生的关键字，不支持自定义关键字](https://ajv.js.org/packages/ajv-i18n.html)
- 自定义关键字如何定义错误信息

#### 如何自定义错误信息

- [自定义错误信息只支持原生的关键字，不支持自定义关键字](https://github.com/ajv-validator/ajv-errors)
- **ajv-errors 在 json-schema 中自定义错误只 返回'应当通过 "errorMessage 关键词校验"** 是因为 ajv-errors 和 ajv-i18n 两个之间冲突了

## 4

### 4-1 课程目标和接口定义

#### 本章目标

- 确定组件的接口和其定义
- 开发入口组件的实现
- 开发基础渲染的实现

##### 接口，即 props

###### API 设计

```jsx
<JsonSchemaForm
  schema={schema}
  value={value}
  onChange={handleChange}
  locale={locale}
  contextRef={someRef}
  uiSchema={uiSchema}
/>
```

###### Props

- schema
  json schema 对象，用来定义数据，同时也是我们定义表单的依据
- value
  表单的数据结果，你可以从外部改变这个 value，在表单被编辑的时候，会通过`onChange`透过 value 需要注意的是，因为 vue 使用的是可变数据，如果每次数据变化我们都去改变`value`的对象地址，那么会导致整个表单都需要重新渲染，这会导致性能降低。
  从实践中来看，我们传入的对象，在内部修改其 field 的值基本不会有什么副作用，所以我们会使用这种方式来进行实现。也就是说，如果`value`是一个对象，那么从`JsonSchemaForm`内部修改的值，并不会改变`value`对象本身。我们仍然会触发`onChange`，因为可能在表单变化之后，使用者需要进行一些操作。
- locale
  语言，使用 `ajv-i18n`指定错误信息使用的语言
- onChange
  在表单值有任何变化的时候会触发该回调方法，并把新的值进行返回
- contextRef
  你需要传入一个 vue3 的`Ref`对象，我们会在这个对象上挂载`doValidate`方法，你可以通过
  ```ts
  const yourRef = ref({});
  onMounted(() => {
    yourRef.value.doValidate();
  });
  <JsonSchemaForm contextRef={yourRef} />;
  ```
  这样来主动让表单进行校验。
  - uiSchema
    对表单的展示进行一些定制，其类型如下：

```ts
export interface VueJsonSchemaConfig {
  title?: string;
  description?: string;
  component?: string;
  additionProps?: {
    [key: string]: any;
  };
  withFormItem?: boolean;
  widget?: "checkbox" | "textarea" | "select" | "radio" | "range" | string;
  items?: UISchema | UISchema[];
}
export interface UISchema extends VueJsonSchemaConfig {
  properties?: {
    [property: string]: UISchema;
  };
}
```

## 5

### 5-1 utils.ts+type.ts 的定义

其中使用了以下几个插件 jsonpointer，lodash.union，json-schema-merge-allof

#### [jsonpointer](https://www.npmjs.com/package/jsonpointer)

```ts
import jsonpointer from "jsonpointer";
var obj = { foo: 1, bar: { baz: 2 }, qux: [3, 4, 5] };

jsonpointer.get(obj, "/foo"); // returns 1
jsonpointer.get(obj, "/bar/baz"); // returns 2
jsonpointer.get(obj, "/qux/0"); // returns 3
jsonpointer.get(obj, "/qux/1"); // returns 4
jsonpointer.get(obj, "/qux/2"); // returns 5
jsonpointer.get(obj, "/quo"); // returns undefined

jsonpointer.set(obj, "/foo", 6); // sets obj.foo = 6;
jsonpointer.set(obj, "/qux/-", 6); // sets obj.qux = [3, 4, 5, 6]

var pointer = jsonpointer.compile("/foo");
pointer.get(obj); // returns 1
pointer.set(obj, 1); // sets obj.foo = 1
```

#### [lodash.union](https://www.lodashjs.com/docs/lodash.union/)

```ts
import union from "lodash.union";
// 创建一个按顺序排列的唯一值的数组。所有给定数组的元素值使用SameValueZero做等值比较。（注： arrays（数组）的并集，按顺序返回，返回数组的元素是唯一的)
// 合并时不要包含重复的值
union([2], [1, 2]);
// => [2, 1]
```

#### [json-schema-merge-allof](https://github.com/techiedarren/json-schema-merge-allof/tree/master)

参考文章：
[1](https://blog.csdn.net/weixin_42534940/article/details/103615260)
[2](https://json-schema.org/understanding-json-schema/reference/combining.html)

The keywords used to combine schemas are:

- allOf: Must be valid against all of the subschemas (校验对象要满足所有子 schema)
- anyOf: Must be valid against any of the subschemas (校验对象要满足至少一个子 schema)
- oneOf: Must be valid against exactly one of the subschemas (校验对象要满足其中一个子 schema)
  All of these keywords must be set to an array, where each item is a schema.(上面的三个，所有这些关键字都必须设置为一个数组，其中每个项都是一个模式)
  In addition, there is:
- not: Must not be valid against the given schema （不满足校验条件时，才通过）

##### 举例

**待校验内容**

```ts
{
    "count": 50
}

```

1、**allOf**:所有条件满足时，校验才会通过
schema 示例：

```
{
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "http://example.com/root.json",
	"type": "object",
	"required": [],
	"properties": {
		"count": {
			"$id": "#/properties/count",
			"allOf": [{
			  "type": "number"
			},
			{
			  "minimum": 90
			}]
		}
	}
}

```

校验结果：

```
// 不通过，最小值90
{
    "schemaLocation": "#/properties/count",
    "pointerToViolation": "#/count",
    "causingExceptions": [
        {
            "schemaLocation": "#/properties/count/allOf/1",
            "pointerToViolation": "#/count",
            "causingExceptions": [],
            "keyword": "minimum",
            "message": "50 is not greater or equal to 90"
        }
    ],
    "keyword": "allOf",
    "message": "#: only 1 subschema matches out of 2",
    "validateResult": "FAILED"
}

```

2、**anyOf**:只要有一个满足条件，校验就可以成功
schema 示例：

```
{
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "http://example.com/root.json",
	"type": "object",
	"required": [],
	"properties": {
		"count": {
			"$id": "#/properties/count",
			"anyOf": [{
			  "type": "number"
			},
			{
			  "minimum": 20
			}]
		}
	}
}

```

校验结果：

```
// 校验 type 和 mininum，通过了

```

3、**oneOf**:有且仅有一个条件满足时，校验才能通过
schema 示例：

```
{
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "http://example.com/root.json",
	"type": "object",
	"required": [],
	"properties": {
		"count": {
			"$id": "#/properties/count",
			"oneOf": [{
			  "type": "number"
			},
			{
			  "minimum": 20
			}]
		}
	}
}
```

校验结果：

```
// 只能有一个条件，而不是两个条件
{
    "schemaLocation": "#/properties/count",
    "pointerToViolation": "#/count",
    "causingExceptions": [],
    "keyword": "oneOf",
    "message": "#: 2 subschemas matched instead of one",
    "validateResult": "FAILED"
}


```

4、**not**:不满足校验条件时，校验才能通过
schema 示例：

```
{
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "http://example.com/root.json",
	"type": "object",
	"required": [],
	"properties": {
		"count": {
			"$id": "#/properties/count",
			"not": {
			  "type": "number"
			}
		}
	}
}

```

校验结果：

```
{
    "schemaLocation": "#/properties/count",
    "pointerToViolation": "#/count",
    "causingExceptions": [],
    "keyword": "not",
    "message": "subject must not be valid against schema {\"type\":\"number\"}",
    "validateResult": "FAILED"
}

```

##### 复杂示例

待校验内容

```ts
{
    "ARRAY": [
        {
            "item": 2
        },
        {
            "item": "true"
        }
    ]
}

```

schema 示例

```ts
// 数组元素可能存在不同类型的取值，这里对数组元素进行了多种可能性的校验
{
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/root.json",
    "type": "object",
    "required": [],
    "properties": {
        "ARRAY": {
            "$id": "#/properties/ARRAY",
            "type": "array",
            "items": {
                "$id": "#/properties/ARRAY/items",
                "type": "object",
                "required": [],
                "oneOf": [
                    {
                        "properties": {
                            "item": {
                                "$id": "#/properties/ARRAY/items/properties/item",
                                "type": "number",
                                "minimum": 1
                            }
                        }
                    },
                    {
                        "properties": {
                            "item": {
                                "$id": "#/properties/ARRAY/items/properties/item",
                                "type": "string",
                                "parttern": "true"
                            }
                        }
                    }
                ]
            }
        }
    }
}

```

## 6 单元测试

Jest

### 6-1

#### 为什么要单元测试

- 检测 bug
- 提升回归效率
- 保证代码质量

##### 官网使用 vue-test-utils

- 覆盖率

### 6-3 如何使用 jest 写测试用例

- describle(表示这里是一个单元测试套件，每个 describle 下都是争对某一个方面的测试)
- it(用在 describle 下，表示要符合的某个条件)
- test（一般不怎么使用,和 it 差不多）

```ts
// test() 和 it() 是一样的 用哪个都行 test() 是 jest 提供的 it() 是 mocha 提供的
// describe() 用来分组 一个 describe() 里面可以有多个 it() 或者 test()
// describe() 里面也可以有多个 describe() 形成多层级的分组
// describe() 里面可以写钩子函数
```

#### 断言

期望满足什么结果，需要判断是否匹配

```ts
describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    }); // shallowMount()  浅渲染 也就是只渲染当前组件 不渲染子组件
    expect(wrapper.text()).toMatch(msg);
    // text() 获取元素的文本内容 toMatch() 匹配正则，或者字符串，
    // toBe() 匹配基本类型 toEqual() 匹配引用类型 toStrictEqual() 匹配严格相等
    // toContain() 匹配数组或者字符串中是否包含某个元素 toHaveLength() 匹配数组或者字符串的长度
    // toHaveProperty() 匹配对象是否包含某个属性
    // .not.toBe() 取反 不匹配这个值就通过 其他api同理
  });
});
``;
```

#### 预设和清理

对于全局的数据可以设置初始化值和清除值，在每个测试用例之前，保证值都是一样的

- beforeEach/afterEach
- beforeAll/afterAll
- 作用域（一个 describe 里面就是一个作用域）

```ts
beforeEach(() => {
  // 每个测试用例执行前都会执行
  console.log("beforeEach");
});

afterEach(() => {
  // 每个测试用例执行后都会执行
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
```

#### 异步测试

- 使用 done

```ts
it("1+2 = 3", (done) => {
  setTimeout(() => {
    expect(1 + 2).toBe("3");
    done();
  }, 1000);
});
```

- return Promise

```ts
it("1+2 = 3", () => {
  return new Promise((resolve) => {
    expect(1 + 2).toBe("3");
    resolve("ok");
  });
});
```

- async await 的方式

  vue 的 props 更新，更新到 dom 这个过程是异步的，不是同步的

```ts
it("async", async () => {
  const msg = "new message";
  const wrapper = shallowMount(HelloWorld, {
    props: { msg },
  });
  expect(wrapper.text()).toMatch(msg);
  await wrapper.setProps({
    msg: "更新了的值",
  });
  expect(wrapper.text()).toMatch("12");
});
```

### 6-4 如何使用 vue test utils 写测试用例

参见 jsonSchemaForm 的单元测试。

### 6-7 单元测试的指标讲解

```ts
// -- 的意思是 要将--coverage这个传递给vue-cli-service 传递给jest
npm run test:unit -- --coverage
// 展示的是依赖的所有文件和执行覆盖率
/**
 * package.json中配置 vue-cli-service 将jest又封装了一层
 *  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "test:unit": "vue-cli-service test:unit -- coverage",
    "lint": "vue-cli-service lint"
  },
 */
```

可以根据这个来优化自己的单元测试，默认会生成一个文件夹/coverage
从左到右依次表示的内容分别是

- Stmts 语句覆盖率
- Lines 行覆盖率
- Branch 不同条件的 if else 是否都有执行到
- Funcss 是否每个函数有都被执行到 （以上都是 100 表示都被执行到，否则表示覆盖率非 100%）
- 最后一列，表示没有被执行到的的行数
