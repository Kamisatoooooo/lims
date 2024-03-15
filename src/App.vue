<template>
  <router-view></router-view>
</template>
<script>
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}

</script>
<style>
#app {
  margin-top: 0px;
}

body {
  margin: 0;
  padding: 0;
  border: 0;
}
</style>