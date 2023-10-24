import { defineComponent } from "vue";
import { selectWidgetPropsDefine } from "../types";
const TextWidget: any = defineComponent({
  name: "SelectionWidget",
  props: selectWidgetPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      props.onChange(e.target.value);
    };
    return () => {
      const { options } = props;
      // multiple 为true时，可以多选, 为false时，只能单选
      return (
        <input type="text" value={props.value as any} onInput={handleChange} />
      );
    };
  },
});
export default TextWidget;
