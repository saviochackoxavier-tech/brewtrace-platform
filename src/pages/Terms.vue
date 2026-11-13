<script setup lang="ts">
import { NAV_LINKS } from '../data/nav.js';
</script>

<template>
  <Article />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Article from './LegalArticle.vue';

export default defineComponent({
  name: 'Terms',
  components: { Article },
});
</script>
