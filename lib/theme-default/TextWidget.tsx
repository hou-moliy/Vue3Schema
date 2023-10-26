import { defineComponent } from "vue";
import { commonWidgetPropsDefine } from "../types";
const TextWidget: any = defineComponent({
  name: "TextWidget",
  props: commonWidgetPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      console.log(e);
      const value = e.target.value;
      e.target.value = props.value;
      props.onChange(value);
    };
    return () => {
      return (
        <input type="text" value={props.value as any} onInput={handleChange} />
      );
    };
  },
});
export default TextWidget;