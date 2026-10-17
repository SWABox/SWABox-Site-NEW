<template>
  <TurnstileChallenge :notice="notice" @verified="handleVerified" @error="handleError" />
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TurnstileChallenge from '../components/TurnstileChallenge.vue';

const route = useRoute();
const router = useRouter();
const notice = ref('');

// 验证完回到来时那页；只接受站内路径，免得被拼出外链。
function goBack() {
  const redirect = route.query.redirect;
  router.push(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/');
}

async function handleVerified(token) {
  notice.value = '';

  try {
    const response = await fetch('/api/verify-turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();

    if (!result.success) {
      notice.value = result.message || '验证没有通过，请再试一次。';
      return;
    }

    localStorage.setItem('swabox_verified', JSON.stringify({ valid: true, ts: Date.now() }));
    goBack();
  } catch (error) {
    console.error('[SWABox] 验证请求失败：', error);
    notice.value = '验证服务暂时连不上，检查一下网络，或者过会儿再来。';
  }
}

function handleError(message) {
  notice.value = message;
}
</script>