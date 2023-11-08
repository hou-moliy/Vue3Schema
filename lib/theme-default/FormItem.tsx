import { defineComponent } from "vue";
import { commonWidgetPropsDefine } from "../types";
import { createUseStyles } from "vue-jss";
const useStyles = createUseStyles({
  container: {},
  label: {
    display: "block",
    color: "#777",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    margin: "5px 0 0 0",
    padding: "0 0 0 20px",
  },
});
const FormItem = defineComponent({
  name: "FormItem",
  props: commonWidgetPropsDefine,
  setup(props, { slots }) {
    const classesRef = useStyles();
    return () => {
      const { schema, errors } = props;
      const classes = classesRef.value;
      // console.log("errors", errors);
      return (
        <div class={classes.container}>
          <label class={classes.label}>
            <span>{schema.title}</span>
          </label>
          {slots.default && slots.default()}
          <ul class={classes.errorText}>
            {errors?.map((err, index) => (
              <li key={`${err}_${index}`}>{err}</li>
            ))}
          </ul>
        </div>
      );
    };
  },
});
export default FormItem;

// HOC: higher order component
// attrs: 传递给组件的属性 , props: 组件自身的属性
// 一般attrs是在，我们没有定义这个props,但是又想要传递给组件的属性
export function WithFormItem(WidgetComponent: any) {
  return defineComponent({
    name: `Wrapped${WidgetComponent.name}`,
    props: commonWidgetPropsDefine,
    setup(props, { attrs }) {
      return () => {
        return (
          <FormItem {...props}>
            <WidgetComponent {...props} {...attrs} />
          </FormItem>
        );
      };
    },
  }) as any;
}
