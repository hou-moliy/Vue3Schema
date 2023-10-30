import { defineComponent } from "vue";
import { commonWidgetPropsDefine } from "../types";
const NumberWidget: any = defineComponent({
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
});
export default NumberWidget;
