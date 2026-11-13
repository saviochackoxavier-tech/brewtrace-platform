<template>
  <Header />
  <main class="app-main">
    <RouterView />
  </main>
</template>

<style scoped>
.app-main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}
</style>
