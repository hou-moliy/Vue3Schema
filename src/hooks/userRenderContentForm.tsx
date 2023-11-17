import { reactive, Ref, ref } from "vue";
import { useStyles } from "@/css/appStyle"; // 引入开源项目，用js写css
import { Classes, GenerateId } from "jss";
import { ThemeProvider } from "../../lib/index";
import SchemaForm from "../../lib";
import themeDefault from "../../lib/theme-default";
import customFormat from "../plugins/customFormats/index";
import customKeyword from "../plugins/customKeywords/index";

const toJson = (data: any) => {
  return JSON.stringify(data, null, 2); // 保留格式的json转换
};
type Schema = any;
type UISchema = any;
interface DataType {
  schema: Schema | null;
  data: any;
  uiSchema: UISchema | null;
  schemaCode: string;
  dataCode: string;
  uiSchemaCode: string;
  customValidate?: (d: any, e: any) => void;
  inline?: boolean;
}
// 写一个hook，用于渲染表单内容
const useRenderContentForm = (demo: DataType) => {
  const widgetList = reactive([]);
  const classesRef = useStyles();
  const layoutList = reactive([]);
  const contextRef: Ref<any> = ref();

  const handleChange = (v: any) => {
    demo.data = v;
    demo.dataCode = toJson(v);
  };
  const renderContentForm = (classes: Classes) => {
    return (
      <vue-draggable
        list={widgetList}
        force-fallback={true}
        group="list"
        itemKey="name"
        fallbackOnBody={true}
      >
        {{
          item: ({ element }: { element: any }) => {
            if (element.type === "layout") {
              // 布局组件
              return (
                <div class={classes.layout}>
                  <div class={classes.menuGroupName}>{element.name}</div>
                  <div class={classes.layoutContent}>
                    <div
                      class={classes.layoutContentText}
                      v-show={!layoutList.length}
                    >
                      拖入子组件
                    </div>
                    <vue-draggable
                      list={layoutList}
                      force-fallback={true}
                      group="list"
                      itemKey="name"
                      fallbackOnBody={true}
                    >
                      {{
                        item: ({ element }: { element: any }) => {
                          return (
                            <ThemeProvider theme={themeDefault}>
                              <SchemaForm
                                schema={element.schema}
                                uiSchema={element.uiSchema || {}}
                                onChange={handleChange}
                                value={element.data}
                                contextRef={contextRef}
                                customValidate={element.customValidate}
                                inline={element.name.inline}
                                customFormats={customFormat}
                                customKeywords={customKeyword}
                              />
                            </ThemeProvider>
                          );
                        },
                      }}
                    </vue-draggable>
                  </div>
                </div>
              );
            } else {
              return (
                <ThemeProvider theme={themeDefault}>
                  <SchemaForm
                    schema={element.schema}
                    uiSchema={element.uiSchema || {}}
                    onChange={handleChange}
                    value={element.data}
                    contextRef={contextRef}
                    customValidate={element.customValidate}
                    inline={element.name.inline}
                    customFormats={customFormat}
                    customKeywords={customKeyword}
                  />
                </ThemeProvider>
              );
            }
          },
        }}
      </vue-draggable>
    );
  };
  return {
    widgetList,
    layoutList,
    classesRef,
    contextRef,
    handleChange,
    renderContentForm,
  };
};
export default useRenderContentForm;
