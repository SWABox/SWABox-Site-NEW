<template>
  <div ref="root" class="shell">
    <a href="#main" class="skip-link">跳到主要内容</a>

    <TermsConsent />

    <NavBar />

    <main id="main">
      <HeroSection />
      <IssueSection />
      <Features />
      <TechStack />
      <DownloadSection />
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import DownloadSection from './DownloadSection.vue';
import Features from './Features.vue';
import HeroSection from './HeroSection.vue';
import IssueSection from './IssueSection.vue';
import NavBar from './NavBar.vue';
import SiteFooter from './SiteFooter.vue';
import TechStack from './TechStack.vue';
import TermsConsent from './TermsConsent.vue';
import { useReveal } from '../composables/useReveal';

const root = useReveal();
</script>

<style scoped>
.shell {
  min-height: 100vh;
}
</style>
