<template>
  <input type="text" @input="handleChange" />
</template>
<script lang="ts" setup>
import { ref, PropType } from "vue";
import { Schema, FiledPropsDefine } from "../types";
const props = defineProps(FiledPropsDefine);
const handleChange = (e: any) => {
  console.log(e, "StringField");
  props.onChange(e.target.value);
};
</script>
