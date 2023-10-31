import { defineComponent } from "vue";
import {
  commonWidgetPropsDefine,
  CommonWidgetDefine,
} from "../../../lib/types";
import { WithFormItem } from "../../../lib/theme-default/FormItem";
const widget: CommonWidgetDefine = defineComponent({
  name: "PasswordWidget",
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
        <input
          type="password"
          value={props.value as any}
          onInput={handleChange}
        />
      );
    };
  },
}) as CommonWidgetDefine;

const PasswordWidget: CommonWidgetDefine = WithFormItem(widget);
export default PasswordWidget;
