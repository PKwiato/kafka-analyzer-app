<script setup lang="ts">

defineProps<{
  csvFile: File | null;
  isAnalyzing: boolean;
}>();

const emit = defineEmits<{
  (e: 'file-uploaded', event: Event): void;
  (e: 'analyze'): void;
}>();
</script>

<template>
  <section class="hero-upload card">
    <div class="hero-content">
      <div class="icon-circle">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
      </div>
      <h2>Start Analysis</h2>
      <p>Upload your Kafka CSV dump to generate rich charts and fixture reports.</p>
      
      <div class="upload-controls">
        <label class="custom-file-upload">
          <input type="file" accept=".csv" @change="(e) => emit('file-uploaded', e)" />
          <span>{{ csvFile ? csvFile.name : 'Choose CSV File' }}</span>
        </label>
        <button class="btn-hero" :disabled="!csvFile || isAnalyzing" @click="emit('analyze')">
          <span class="btn-content" v-if="!isAnalyzing">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            Analyze Data
          </span>
          <span class="btn-content" v-else>
            <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            Analyzing...
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-upload {
  padding: 3rem;
  text-align: center;
}

.icon-circle {
  width: 64px;
  height: 64px;
  background: #f5f3ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.hero-upload h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.hero-upload p {
  color: #64748b;
  margin-bottom: 2rem;
}

.upload-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}

.custom-file-upload {
  border: 1px solid #d1d5db;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.2s;
}

.custom-file-upload:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.custom-file-upload input {
  display: none;
}

.btn-hero {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4), 0 2px 4px -1px rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-hero:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.5), 0 4px 6px -2px rgba(99, 102, 241, 0.3);
}

.btn-hero:active:not(:disabled) {
  transform: translateY(0);
}

.btn-hero:disabled {
  background: #cbd5e1;
  color: white;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
