<template>
  <RouterView />
  <div class="bottom-nav">
    <button class="nav-button">
      <i class="icon">📚</i>
    </button>
    <button class="nav-button">
      <i class="icon">🔍</i>
    </button>
    <button class="nav-button add-button">
      <i class="icon">➕</i>
    </button>
    <button class="nav-button">
      <i class="icon">📖</i>
    </button>
    <button class="nav-button">
      <i class="icon">⚙️</i>
    </button>
  </div>
</template>

<script setup>
</script>

<style scoped>
.bottom-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  gap: 1rem;
  border-radius: 1rem;
  margin: 0 auto;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
}

.nav-button {
  background: none;
  border: none;
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
  border-radius: 4px;
}

.nav-button:hover {
  background-color: #f5f5f5;
}

.nav-button:active {
  background-color: #e0e0e0;
}

.add-button {
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  padding: 0.75rem;
}

.icon {
  display: inline-block;
}

@media screen and (max-width: 767px) {
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border-radius: 0;
    transform: none;
  }
}
</style>
