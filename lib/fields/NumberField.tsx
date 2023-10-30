import { defineComponent } from "vue";
import { FiledPropsDefine, CommonWidgetNames } from "../types";
import { getWidget } from "../theme";
export default defineComponent({
  name: "NumberFeild",
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      const num = Number(v);
      if (Number.isNaN(num)) {
        props.onChange(undefined);
      } else {
        props.onChange(num);
      }
    };
    const NumberWidgetRef = getWidget(CommonWidgetNames.NumberWidget);
    return () => {
      // 这样写是为了让 NumberWidget 可以响应式更新
      const NumberWidget = NumberWidgetRef.value;
      const { rootSchema, errorSchema, ...rest } = props;
      // ...rest 会把 props 中的 onChange 也传递给 NumberWidget
      // 但是 NumberWidget 不需要 onChange，所以要把 onChange 去掉
      return (
        <NumberWidget
          {...rest}
          errors={errorSchema.__errors}
          onChange={handleChange}
        />
      );
    };
  },
});
