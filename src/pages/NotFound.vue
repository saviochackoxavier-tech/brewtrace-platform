<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  router.replace('/');
});
</script>

<template>
  <section class="notfound glass anim-fade-in">
    <div class="notfound-inner">
      <span class="notfound-emoji">☕</span>
      <p class="notfound-text">Page not found.</p>
      <a class="btn btn-primary" href="/">Return home</a>
    </div>
  </section>
</template>

<style scoped>
.notfound {
  padding: 2.5rem 0;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.notfound-inner {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
  padding: 0 1.5rem;
}

.notfound-emoji {
  font-size: 4rem;
  color: #22d3ee;
  filter: drop-shadow(0 0 16px rgba(34, 211, 238, 0.4));
}

.notfound-text {
  color: var(--text-secondary);
  font-size: 1.05rem;
  margin-bottom: 1rem;
}
</style>
