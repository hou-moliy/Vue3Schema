import { defineComponent } from "vue";
import { commonWidgetPropsDefine, CommonWidgetDefine } from "../types";
import { WithFormItem } from "./FormItem";
const widget = defineComponent({
  name: "NumberWidget",
  props: commonWidgetPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      const value = e.target.value;
      e.target.value = props.value;
      props.onChange(value);
    };
    return () => {
      return (
        <input
          type="number"
          value={props.value as any}
          onInput={handleChange}
        />
      );
    };
  },
}) as CommonWidgetDefine;
const NumberWidget: any = WithFormItem(widget);
export default NumberWidget;
