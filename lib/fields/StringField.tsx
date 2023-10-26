import { defineComponent } from "vue";
import { FiledPropsDefine, CommonWidgetNames } from "../types";
import { getWidget } from "../theme";

export default defineComponent({
  name: "StringFeild",
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      props.onChange(e);
    };
    const TextWidget = getWidget(CommonWidgetNames.TextWidget).value;
    return () => {
      return <TextWidget {...props} onChange={handleChange} />;
    };
  },
});
