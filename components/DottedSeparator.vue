<script setup lang="ts">
import { cn } from "@/lib/utils";

interface DottedSeparatorProps {
  class?: string;
  color?: string;
  height?: string;
  dotSize?: string;
  gapSize?: string;
  direction?: "horizontal" | "vertical";
}

const props = withDefaults(defineProps<DottedSeparatorProps>(), {
  color: "#d4d4d8",
  height: "2px",
  dotSize: "2px",
  gapSize: "6px",
  direction: "horizontal",
});

const isHorizontal = props.direction === "horizontal";

const styles = {
  width: isHorizontal ? "100%" : props.height,
  height: isHorizontal ? props.height : "100%",
  backgroundImage: `radial-gradient(circle, ${props.color} 25%, transparent 25%)`,
  backgroundSize: isHorizontal
    ? `${parseInt(props.dotSize) + parseInt(props.gapSize)}px ${props.height}`
    : `${props.height} ${parseInt(props.dotSize) + parseInt(props.gapSize)}px`,
  backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
  backgroundPosition: "center",
};
</script>

<template>
  <div
    :class="
      cn(
        isHorizontal
          ? 'w-full flex items-center'
          : 'h-full flex flex-col items-center',
        props.class
      )
    "
  >
    <div :class="isHorizontal ? 'flex-grow' : 'flex-grow-0'" :style="styles" />
  </div>
</template>
