<script setup lang="ts">
import type { AnalysisResults } from '../composables/useCsvProcessor';

defineProps<{
  results: AnalysisResults;
}>();
</script>

<template>
  <div class="stats-container">
    <!-- First Row: General Coverage & OK Status -->
    <div class="stats-grid grid-3">
      <div class="stat-card">
        <span class="stat-label">Total Rows</span>
        <p class="stat-value">{{ results.totalRows }}</p>
      </div>
      <div class="stat-card">
        <span class="stat-label">Matched IDs</span>
        <p class="stat-value">{{ results.percentMatched }}% <small>({{ results.matchedCount }})</small></p>
      </div>
      <div class="stat-card">
        <span class="stat-label">OK</span>
        <p class="stat-value text-green">{{ results.percentPassed }}% <small>({{ results.passedCount }})</small></p>
      </div>
    </div>

    <!-- Second Row: Detailed Issue Breakdown -->
    <div class="stats-grid grid-4">
      <div class="stat-card">
        <span class="stat-label">Flagged Issues</span>
        <p class="stat-value text-red">{{ results.percentFailedInMatched }}% <small>({{ results.failedCount }})</small></p>
      </div>
      <div class="stat-card">
        <span class="stat-label">Missing (0)</span>
        <p class="stat-value text-red">{{ results.percentMissing }}% <small>({{ results.missingMatchCount }})</small></p>
      </div>
      <div class="stat-card">
        <span class="stat-label">Partial (>0)</span>
        <p class="stat-value text-red">{{ results.percentPartial }}% <small>({{ results.partialMatchCount }})</small></p>
      </div>
      <div class="stat-card">
        <span class="stat-label">Over (> Set)</span>
        <p class="stat-value text-red">{{ results.percentOver }}% <small>({{ results.overMatchCount }})</small></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  gap: 1.5rem;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-weight: 600;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0.5rem 0 0;
}

.stat-value small {
  font-size: 1rem;
  font-weight: 400;
  color: #94a3b8;
}

.text-red { color: #ef4444; }
.text-green { color: #10b981; }

@media (max-width: 1024px) {
  .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .grid-3, .grid-4 { grid-template-columns: 1fr; }
}
</style>
