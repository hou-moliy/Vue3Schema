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
// 参考schema - tests文件夹下的test.js文件;
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

- 确定组件的借口和其定义
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
