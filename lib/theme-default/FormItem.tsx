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
export default defineComponent({
  name: "FormItem",
  props: commonWidgetPropsDefine,
  setup(props, { slots }) {
    const classesRef = useStyles();
    return () => {
      const { schema, errors } = props;
      const classes = classesRef.value;
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
