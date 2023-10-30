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
      const { rootSchema, errorSchema, ...rest } = props;
      return (
        <TextWidget
          {...rest}
          errors={errorSchema.__errors}
          onChange={handleChange}
        />
      );
    };
  },
});
