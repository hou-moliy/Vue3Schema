import { defineComponent, computed } from "vue";
import { FiledPropsDefine, CommonWidgetNames } from "../types";
import { getWidget } from "../theme";

export default defineComponent({
  name: "StringFeild",
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      props.onChange(e);
    };
    // 使用computed来获取TextWidget，这样TextWidget的值就是响应式的
    const TextWidgetRef = computed(() => {
      console.log(props.uiSchema, "props.uiSchema");
      const widgetRef = getWidget(CommonWidgetNames.TextWidget, props.uiSchema);
      return widgetRef.value;
    });
    const TextWidget = TextWidgetRef.value;
    console.log(TextWidget, "TextWidget");
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
