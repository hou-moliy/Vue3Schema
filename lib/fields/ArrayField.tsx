import { defineComponent, PropType } from "vue";
import { FiledPropsDefine, Schema } from "../types";
import { useVJSFContext } from "../context";
import { createUseStyles } from "vue-jss";
import SelectionWidget from "../widgets/Selection";
/**
 * items是一个对象
 *
 *   items: { type: string },
 *
 * ====> x:[
 * 'hyz',
 *  75
 * ]
 *items数组的所有子item可以不是同一种类型
 *items是一个数组
 *   items: [
 *    { type: string },
 *    { type: number }
 *   ]
 *
 * ====> x:[{
 *  name:'hyz',
 *  age:75
 * }]
 *
 *items是一个对象，但是值是可选的
 * items: { type: string, enum: ['1', '2'] }, enum里面是可选值
 *
 * ====> x:['1','2']
 */
// 样式
const useStyles = createUseStyles({
  container: {
    // 类名 container
    border: "1px solid #eee",
  },
  actions: {
    // 类名 actions
    background: "#eee",
    padding: 10, // 10px
    textAlign: "right",
  },
  action: {
    // 类名 action
    "& + &": {
      // 选择器 + 选择器 选择器相邻的兄弟元素
      marginLeft: 10, // 10px
    },
  },
  content: {
    // 类名 content
    padding: 10,
  },
});

// ArrayField的子组件 用来包裹每一个item 用来处理删除 添加 以及 上移 下移
const ArrayItemWrapper = defineComponent({
  name: "ArrayItemWrapper",
  props: {
    onAdd: {
      type: Function as PropType<() => void>, // 类型断言 用来告诉ts这是一个函数 传入一个index 返回void
      required: true,
    },
    onDelete: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onUp: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onDown: {
      type: Function as PropType<() => void>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { slots }) {
    const classesRef = useStyles();

    const handleAdd = () => props.onAdd();

    const handleDelete = () => props.onDelete();

    const handleUp = () => props.onUp();

    const handleDown = () => props.onDown();

    return () => {
      const classes = classesRef.value;
      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button class={classes.action} onClick={handleDelete}>
              删除
            </button>
            <button class={classes.action} onClick={handleAdd}>
              添加
            </button>
            <button class={classes.action} onClick={handleUp}>
              上移
            </button>
            <button class={classes.action} onClick={handleDown}>
              下移
            </button>
          </div>
          <div class={classes.content}>
            <div>{slots.default && slots.default()}</div>
          </div>
        </div>
      );
    };
  },
});

export default defineComponent({
  name: "ArrayField",
  props: FiledPropsDefine,
  setup(props) {
    const context = useVJSFContext();

    const handleArrayItemChange = (v: any, index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      arr[index] = v;
      props.onChange(arr);
    };
    const onAdd = (value: any) => {
      const newV = Array.isArray(value) ? value : [];
      newV.push("");
      props.onChange(newV);
    };
    const onDelete = (value: any, index: number) => {
      const newV = Array.isArray(value) ? value : [];
      newV.splice(index, 1);
      props.onChange(newV);
    };
    const onUp = (value: any, index: number) => {
      const newV = Array.isArray(value) ? value : [];
      if (index === 0) return; // 如果是第一个就不用上移了
      const item = newV.splice(index, 1); // splice返回的是一个数组 ，返回的是删除的元素
      newV.splice(index - 1, 0, item[0]);
      props.onChange(newV);
    };
    const onDown = (value: any, index: number) => {
      const newV = Array.isArray(value) ? value : [];
      if (index === newV.length - 1) return; // 如果是最后一个就不用下移了
      const item = newV.splice(index, 1);
      newV.splice(index + 1, 0, item[0]);
      props.onChange(newV);
    };
    return () => {
      const { schema, rootSchema, value } = props;
      const SchemaFormItems = context.SchemaFormItems;
      // 判断是否是数组
      const isMultiType = Array.isArray(schema.items);
      // 判断是否是同一种类型 有enum 说明是同一种类型 有enum说明是select
      const isSelect = schema.items && (schema.items as any).enum;
      if (isMultiType) {
        const items: Schema[] = schema.items as any;
        const arr = Array.isArray(value) ? value : [];
        return items.map((s: Schema, index: number) => {
          console.log(s, "sss");
          return (
            <SchemaFormItems
              schema={s}
              key={index}
              rootSchema={rootSchema}
              value={arr[index]}
              onChange={(v: any) => handleArrayItemChange(v, index)}
            />
          );
        });
      } else if (!isSelect) {
        // 不是select,是单一类型
        const arr = Array.isArray(value) ? value : [];
        return arr.map((v: any, index: number) => {
          return (
            <ArrayItemWrapper
              key={index}
              onAdd={() => onAdd(value)}
              onDelete={() => onDelete(value, index)}
              onUp={() => onUp(value, index)}
              onDown={() => onDown(value, index)}
              index={index}
            >
              <SchemaFormItems
                schema={schema.items as Schema}
                rootSchema={rootSchema}
                value={v}
                onChange={(v: any) => handleArrayItemChange(v, index)}
              />
            </ArrayItemWrapper>
          );
        });
      } else {
        // 是select 有enum
        const enumOptions = (schema.items as any).enum;
        const options = enumOptions.map((e: any) => ({
          // 判读e是不是对象，是e.key，不是判断是不是字符串，是就e
          key: e.key ? e.key : e,
          value: e.value ? e.value : e,
        }));
        return (
          <SelectionWidget
            value={value}
            options={options}
            onChange={props.onChange}
          ></SelectionWidget>
        );
      }
    };
  },
});
