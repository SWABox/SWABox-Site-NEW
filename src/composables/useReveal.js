import { onBeforeUnmount, onMounted, ref } from 'vue';

// 内容进入视口时轻轻抬一下，只为提示层级，不做持续动画。
// 默认状态是可见的：只有 JS 正常跑起来才加 reveal-ready，脚本出错也不会把内容藏起来。
export function useReveal() {
  const root = ref(null);
  let observer = null;

  onMounted(() => {
    const node = root.value;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = Array.from(node.querySelectorAll('[data-reveal]'));
    if (!items.length) return;

    document.documentElement.classList.add('reveal-ready');
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
    );
    items.forEach((item) => observer.observe(item));
  });

  onBeforeUnmount(() => {
    if (observer) observer.disconnect();
    document.documentElement.classList.remove('reveal-ready');
  });

  return root;
}
