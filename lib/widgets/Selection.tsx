import { defineComponent, PropType, ref, watch } from "vue";

export default defineComponent({
  name: "SelectionWidget",
  props: {
    value: {
      // type: String,
      // required: true,
    },
    options: {
      type: Array as PropType<{ key: string; value: string }[]>,
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
  },
  setup(props) {
    const currentValueRef = ref(props.value);
    watch(currentValueRef, (newV) => {
      if (newV !== props.value) {
        props.onChange(newV);
      }
    });
    watch(
      () => props.value, // 监听props.value的变化
      (newV) => {
        if (newV !== currentValueRef.value) {
          currentValueRef.value = newV;
        }
      },
    );
    return () => {
      const { options } = props;
      // multiple 为true时，可以多选, 为false时，只能单选
      return (
        <select multiple={true} v-model={currentValueRef.value}>
          {options.map((op) => (
            <option value={op.value}>{op.key}</option>
          ))}
        </select>
      );
    };
  },
});
