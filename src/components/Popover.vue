<template>
  <div
    ref="root"
    :style="containerStyle"
    v-show="visible"
    class="vue-popover"
    @keydown.escape.prevent="onEscape"
    tabindex="-1"
  >
    <div class="popover-content" ref="content">
      <slot>
        <div>{{ content }}</div>
      </slot>
    </div>
    <div v-if="showArrow" class="popover-arrow" :style="arrowStyle"></div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  useTemplateRef,
  watch,
  watchEffect,
} from "vue";

const model = defineModel<boolean>({ default: false });

const props = defineProps({
  top: { type: [Number, String], default: null },
  left: { type: [Number, String], default: null },
  position: { type: String as () => "fixed" | "absolute", default: "fixed" },
  offsetX: { type: Number, default: 0 },
  offsetY: { type: Number, default: 0 },
  showArrow: { type: Boolean, default: false },
  content: { type: String, default: "" },
  closeOnOutsideClick: { type: Boolean, default: true },
  anchor: { type: Object as () => HTMLElement | null, default: null },
  placement: {
    type: String as () => "top" | "bottom" | "left" | "right",
    default: "bottom",
  },
});

const root = useTemplateRef<HTMLElement>("root");
const content = useTemplateRef<HTMLElement>("content");
const visible = computed({
  get: () => model.value,
  set: (v) => (model.value = v),
});

const pos = reactive({ top: props.top, left: props.left });

watchEffect(async () => {
  if (model.value) {
    await nextTick();
    root.value?.focus();
    updatePositionFromAnchor();
  }
});

watch(
  () => props.top,
  (v) => (pos.top = v),
);
watch(
  () => props.left,
  (v) => (pos.left = v),
);

function updatePositionFromAnchor() {
  if (!props.anchor || !root.value) return;
  const rect = props.anchor.getBoundingClientRect();
  const popoverRect = root.value.getBoundingClientRect();
  let top = 0,
    left = 0;

  switch (props.placement) {
  case "top":
    top = rect.top - popoverRect.height - props.offsetY;
    left = rect.left + (rect.width - popoverRect.width) / 2 + props.offsetX;
    break;
  case "bottom":
    top = rect.bottom + props.offsetY;
    left = rect.left + (rect.width - popoverRect.width) / 2 + props.offsetX;
    break;
  case "left":
    top = rect.top + (rect.height - popoverRect.height) / 2 + props.offsetY;
    left = rect.left - popoverRect.width - props.offsetX;
    break;
  case "right":
    top = rect.top + (rect.height - popoverRect.height) / 2 + props.offsetY;
    left = rect.right + props.offsetX;
    break;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (top + popoverRect.height > vh) top = vh - popoverRect.height - 4;
  if (top < 0) top = 4;
  if (left + popoverRect.width > vw) left = vw - popoverRect.width - 4;
  if (left < 0) left = 4;

  pos.top = top;
  pos.left = left;
}

const containerStyle = computed(() => {
  const style: Record<string, string> = {
    position: props.position,
    zIndex: "9999",
  };
  if (pos.top != null) style.top = `${pos.top}px`;
  if (pos.left != null) style.left = `${pos.left}px`;
  return style;
});

function open() {
  visible.value = true;
  nextTick(() => {
    if (props.anchor) updatePositionFromAnchor();
    focusWhenOpen();
  });
}
function close() {
  visible.value = false;
}
function toggle() {
  visible.value = !visible.value;
}
function openAt(x: number | string, y: number | string) {
  pos.left = typeof x === "number" ? x : parseFloat(String(x));
  pos.top = typeof y === "number" ? y : parseFloat(String(y));
  nextTick(() => open());
}

function focusWhenOpen() {
  nextTick(() => root.value?.focus());
}

function onDocumentClick(e: MouseEvent) {
  if (!props.closeOnOutsideClick) return;
  const t = e.target as Node;
  if (!root.value) return;
  if (!root.value.contains(t) && (!props.anchor || !props.anchor.contains(t)))
    close();
}

function onEscape() {
  close();
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick, true);
  window.addEventListener("resize", updatePositionFromAnchor);
  window.addEventListener("scroll", updatePositionFromAnchor, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick, true);
  window.removeEventListener("resize", updatePositionFromAnchor);
  window.removeEventListener("scroll", updatePositionFromAnchor, true);
});

const arrowStyle = computed(() => (props.showArrow ? { left: "12px" } : {}));

defineExpose({ open, close, toggle, openAt });
</script>

<style scoped>
.vue-popover {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  min-width: 120px;
  padding: 0.5rem;
  outline: none;
}
.popover-content {
  position: relative;
}
.popover-arrow {
  position: absolute;
  top: -6px;
  width: 12px;
  height: 6px;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: white;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}
</style>
