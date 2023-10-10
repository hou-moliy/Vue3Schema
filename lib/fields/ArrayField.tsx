import { defineComponent } from "vue";
import { FiledPropsDefine, Schema } from "../types";
import { useVJSFContext } from "../context";

/**
 * items是同一种类型
 * {
 *   items: { type: string },
 * }
 *items数组的所有子item可以不是同一种类型
 * {
 *   items: [
 *    { type: string },
 *    { type: number }
 *   ]
 * }
 *
 * {
 *   items: { type: string, enum: ['1', '2'] }, enum里面是可选值
 * }
 */
// ArrayField的子组件 用来包裹每一个item 用来处理删除 添加 以及 上移 下移
const ArrayItemWrapper = defineComponent({
  name: "ArrayItemWrapper",
  props: {
    onAdd: {
      type: Function,
      required: true,
    },
    onDelete: {
      type: Function,
      required: true,
    },
    onUp: {
      type: Function,
      required: true,
    },
    onDown: {
      type: Function,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => {
      return (
        <div>
          <div>
            <button>删除</button>
            <button>添加</button>
            <button>上移</button>
            <button>下移</button>
          </div>
          <div>
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
              onAdd={() => {
                const newV = Array.isArray(value) ? value : [];
                newV.push("");
                props.onChange(newV);
              }}
              onDelete={() => {
                const newV = Array.isArray(value) ? value : [];
                newV.splice(index, 1);
                props.onChange(newV);
              }}
              onUp={() => {
                const newV = Array.isArray(value) ? value : [];
                if (index === 0) return;
                const item = newV.splice(index, 1);
                newV.splice(index - 1, 0, item[0]);
                props.onChange(newV);
              }}
              onDown={() => {
                const newV = Array.isArray(value) ? value : [];
                if (index === newV.length - 1) return;
                const item = newV.splice(index, 1);
                newV.splice(index + 1, 0, item[0]);
                props.onChange(newV);
              }}
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
      }
      return <div>here</div>;
    };
  },
});
