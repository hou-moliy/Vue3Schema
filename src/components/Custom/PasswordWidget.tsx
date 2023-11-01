import { computed, defineComponent } from "vue";
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
      const value = e.target.value;
      e.target.value = props.value;
      props.onChange(value);
    };
    const showPasswordRef = computed(() => {
      return props.options?.showPassword || false;
    });
    return () => {
      return (
        <input
          type={showPasswordRef.value ? "text" : "password"}
          value={props.value as any}
          onInput={handleChange}
        />
      );
    };
  },
}) as CommonWidgetDefine;

const PasswordWidget: CommonWidgetDefine = WithFormItem(widget);
export default PasswordWidget;
