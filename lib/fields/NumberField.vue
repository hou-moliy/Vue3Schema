<template>
  <input type="text" @input="handleChange" />
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { Schema, FiledPropsDefine } from "../types";
const props = defineProps(FiledPropsDefine);
const handleChange = (e: any) => {
  const value = e.target.value;
  const num = Number(value);
  if (Number.isNaN(num)) {
    props.onChange(undefined);
  } else {
    console.log(num, Number.isNaN(num), "NumberField");
    props.onChange(num);
  }
};
</script>
