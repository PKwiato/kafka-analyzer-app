<script setup lang="ts">
import { ref, reactive } from 'vue';
import { DEFAULT_SETTINGS } from '../settings';
import { useCsvProcessor } from '../composables/useCsvProcessor';
import { useTableSort } from '../composables/useTableSort';

import HeroUpload from './HeroUpload.vue';
import AnalysisStats from './AnalysisStats.vue';
import AnalysisCharts from './AnalysisCharts.vue';
import ResultsTable from './ResultsTable.vue';
import SettingsModal from './SettingsModal.vue';

const settings = reactive({ ...DEFAULT_SETTINGS });
const showOnlyFailed = ref(false);
const isSettingsOpen = ref(false);

const {
  csvFile,
  analysisResults,
  isAnalyzing,
  handleFileUpload,
  analyze
} = useCsvProcessor(settings);

const {
  toggleSort,
  filteredTableData
} = useTableSort(analysisResults, showOnlyFailed);
</script>

<template>
  <div class="csv-analyzer">
    <!-- Header with Settings Trigger -->
    <div class="top-actions">
      <button class="btn-icon" @click="isSettingsOpen = true" title="Open Settings">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        Analysis Settings
      </button>
    </div>

    <HeroUpload 
      :csvFile="csvFile" 
      :isAnalyzing="isAnalyzing" 
      @file-uploaded="handleFileUpload" 
      @analyze="analyze" 
    />

    <section v-if="analysisResults" class="results fade-in">
      <div class="section-header">
        <h3>Overview Analysis</h3>
      </div>
      
      <AnalysisStats :results="analysisResults" />
      <AnalysisCharts :results="analysisResults" />
      <ResultsTable 
        :settings="settings"
        :filteredTableData="filteredTableData"
        :showOnlyFailed="showOnlyFailed"
        @update:showOnlyFailed="val => showOnlyFailed = val"
        @toggle-sort="toggleSort"
      />
    </section>

    <SettingsModal 
      :isOpen="isSettingsOpen" 
      :settings="settings" 
      @close="isSettingsOpen = false" 
    />
  </div>
</template>

<style scoped>
.csv-analyzer {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-icon {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
}

.btn-icon:hover {
  background: #f8fafc;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0;
}

.fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
