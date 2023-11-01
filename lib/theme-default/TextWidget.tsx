import { defineComponent, computed } from "vue";
import { commonWidgetPropsDefine, CommonWidgetDefine } from "../types";
import { WithFormItem } from "./FormItem";
const widget: CommonWidgetDefine = defineComponent({
  name: "TextWidget",
  props: commonWidgetPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      console.log(e);
      const value = e.target.value;
      e.target.value = props.value;
      props.onChange(value);
    };
    const styleRf = computed(() => {
      return props.options?.style || {};
    });
    return () => {
      return (
        <input
          type="text"
          value={props.value as any}
          onInput={handleChange}
          style={styleRf.value}
        />
      );
    };
  },
}) as CommonWidgetDefine;

const TextWidget: CommonWidgetDefine = WithFormItem(widget);
export default TextWidget;
