<template>
  <input type="text" :value="props.value" @input="handleChange" />
</template>
<script lang="ts" setup name="StringFeild">
import { ref, PropType } from "vue";
import { Schema, FiledPropsDefine } from "../types";
const props = defineProps(FiledPropsDefine);
const handleChange = (e: any) => {
  // console.log(e, "StringField");
  props.onChange(e.target.value);
};
</script>
