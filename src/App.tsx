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
