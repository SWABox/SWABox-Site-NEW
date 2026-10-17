<template>
  <!-- 没过验证：只给验证页，别的内容都不渲染。 -->
  <TurnstileChallenge
    v-if="securityEnabled && !isHumanVerified"
    :notice="gateNotice"
    @verified="handleVerified"
    @error="handleChallengeError"
  />

  <!-- 过了验证：完整站点。 -->
  <SiteShell v-else />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SiteShell from '../components/SiteShell.vue';
import TurnstileChallenge from '../components/TurnstileChallenge.vue';
import { securityEnabled } from '../data/runtime.js';

const VERIFIED_KEY = 'swabox_verified';
const TTL = 24 * 60 * 60 * 1000;

const route = useRoute();
const router = useRouter();

const isHumanVerified = ref(false);
const gateNotice = ref('');

function readVerified() {
  const saved = localStorage.getItem(VERIFIED_KEY);
  if (!saved) return false;

  try {
    const { ts, valid } = JSON.parse(saved);
    if (valid && Date.now() - ts < TTL) return true;
  } catch (error) {
    console.warn('[SWABox] 本地验证状态已损坏，重新验证。');
  }

  localStorage.removeItem(VERIFIED_KEY);
  return false;
}

function saveVerified() {
  localStorage.setItem(VERIFIED_KEY, JSON.stringify({ valid: true, ts: Date.now() }));
}

function followRedirect() {
  const redirect = route.query.redirect;
  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    router.push(redirect);
  }
}

onMounted(() => {
  isHumanVerified.value = securityEnabled ? readVerified() : true;
});

async function handleVerified(token) {
  gateNotice.value = '';

  try {
    const response = await fetch('/api/verify-turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();

    if (!result.success) {
      gateNotice.value = result.message || '验证没有通过，请再试一次。';
      return;
    }

    saveVerified();
    isHumanVerified.value = true;
    followRedirect();
  } catch (error) {
    console.error('[SWABox] 验证请求失败：', error);
    gateNotice.value = '验证服务暂时连不上，检查一下网络，或者过会儿再来。';
  }
}

function handleChallengeError(message) {
  gateNotice.value = message;
}
</script>
