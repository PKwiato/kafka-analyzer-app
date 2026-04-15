<script setup lang="ts">
import type { AnalysisResults } from '../composables/useCsvProcessor';

defineProps<{
  results: AnalysisResults;
}>();
</script>

<template>
  <div class="stats-grid">
    <div class="stat-card">
      <span class="stat-label">Total Rows</span>
      <p class="stat-value">{{ results.totalRows }}</p>
    </div>
    <div class="stat-card">
      <span class="stat-label">Matched IDs</span>
      <p class="stat-value">{{ results.percentMatched }}% <small>({{ results.matchedCount }})</small></p>
    </div>
    <div class="stat-card">
      <span class="stat-label">Flagged Issues</span>
      <p class="stat-value text-red">{{ results.percentFailedInMatched }}% <small>({{ results.failedCount }})</small></p>
    </div>
    <div class="stat-card">
      <span class="stat-label">Missing (0)</span>
      <p class="stat-value text-orange">{{ results.percentMissing }}% <small>({{ results.missingMatchCount }})</small></p>
    </div>
    <div class="stat-card">
      <span class="stat-label">Partial (>0)</span>
      <p class="stat-value text-yellow">{{ results.percentPartial }}% <small>({{ results.partialMatchCount }})</small></p>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
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
.text-orange { color: #f97316; }
.text-yellow { color: #eab308; }

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
