<script setup lang="ts">
import CsvAnalyzer from './components/CsvAnalyzer.vue'
</script>

<template>
  <header class="app-header">
    <div class="container">
      <h1>Kafka Soccer CSV Analyzer</h1>
      <p>Analyze and visualize your sports data dumps</p>
    </div>
  </header>

  <main>
    <CsvAnalyzer />
  </main>

  <footer class="app-footer">
    <div class="container">
      <p>&copy; 2026 Kafka Soccer Checker. Simple & Maintainable.</p>
    </div>
  </footer>
</template>

<style scoped>
/* Scoped styles can go here if needed */
</style>
