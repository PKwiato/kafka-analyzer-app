<script setup lang="ts">
import type { AppSettings } from '../settings';

defineProps<{
  isOpen: boolean;
  settings: AppSettings;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const addField = (settings: AppSettings) => {
  settings.analysisFields.push({ columnHeader: '', operator: '<', value: 11 });
};

const removeField = (settings: AppSettings, index: number) => {
  settings.analysisFields.splice(index, 1);
};

const updateLeagueIds = (settings: AppSettings, e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  settings.leagueIds = target.value.split(/[\s,]+/)
    .map(s => s.trim())
    .filter(s => s !== '');
};
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Analysis Configuration</h3>
          <button class="btn-close" @click="emit('close')">×</button>
        </div>
        
        <div class="modal-body">
          <div class="setting-item">
            <label>Target League IDs</label>
            <p class="helper">List of IDs to include in the primary analysis</p>
            <textarea 
              :value="settings.leagueIds.join(', ')" 
              @input="updateLeagueIds(settings, $event)"
              rows="3"
            ></textarea>
          </div>

          <div class="setting-item">
            <label>Logic Operator</label>
            <div class="logic-toggle">
              <button :class="{ active: settings.logicOperator === 'OR' }" @click="settings.logicOperator = 'OR'">OR</button>
              <button :class="{ active: settings.logicOperator === 'AND' }" @click="settings.logicOperator = 'AND'">AND</button>
            </div>
          </div>

          <div class="setting-item">
            <label>Analysis Fields & Thresholds</label>
            <p class="helper">Define criteria that trigger a "FAILED" status</p>
            <div v-for="(field, index) in settings.analysisFields" :key="index" class="field-editor">
              <input v-model="field.columnHeader" placeholder="Column Name" />
              <select v-model="field.operator">
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
                <option value="==">==</option>
              </select>
              <input type="number" v-model.number="field.value" />
              <button class="btn-remove" @click="removeField(settings, index)">×</button>
            </div>
            <button class="btn-add" @click="addField(settings)">+ Add New Condition</button>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-hero" @click="emit('close')">Save & Close</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 { margin: 0; font-size: 1.25rem; }

.btn-close {
  background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8;
}

.modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.setting-item { margin-bottom: 1.5rem; }
.setting-item label { display: block; font-weight: 600; margin-bottom: 0.25rem; color: #1e293b; }
.setting-item .helper { font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem; }

textarea, input[type="text"], input[type="number"], select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
}

.logic-toggle {
  display: flex;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 8px;
  gap: 0.25rem;
}

.logic-toggle button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  color: #64748b;
}

.logic-toggle button.active {
  background: white;
  color: #6366f1;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.field-editor {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.field-editor input { flex: 1; }
.field-editor select { width: 80px; }
.field-editor input[type="number"] { width: 80px; }

.btn-remove { background: #fef2f2; color: #ef4444; border: none; padding: 0.5rem 0.75rem; border-radius: 6px; cursor: pointer; }
.btn-add { width: 100%; padding: 0.75rem; border: 2px dashed #e2e8f0; background: none; border-radius: 8px; color: #6366f1; font-weight: 600; cursor: pointer; margin-top: 0.5rem; }

.modal-footer { padding: 1rem 1.5rem; background: #f8fafc; text-align: right; }

.btn-hero {
  background: #6366f1;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
}

.btn-hero:hover {
  background: #4f46e5;
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .field-editor { flex-direction: column; }
  .field-editor select, .field-editor input[type="number"] { width: 100%; }
}
</style>
