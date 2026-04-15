<script setup lang="ts">
import { computed } from 'vue';
import type { AppSettings } from '../settings';

const props = defineProps<{
  settings: AppSettings;
  filteredTableData: any[];
  showOnlyFailed: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:showOnlyFailed', value: boolean): void;
  (e: 'toggle-sort', key: string): void;
}>();

const uniqueFields = computed(() => {
  const fields = new Set<string>();
  props.settings.analysisFields.forEach(f => fields.add(f.columnHeader));
  return Array.from(fields);
});
</script>

<template>
  <div class="table-section card">
    <div class="table-header">
      <div class="header-left">
        <h4>Flagged Fixtures</h4>
        <p>Showing fixtures matching your configured League IDs</p>
      </div>
      <div class="table-filters">
        <label class="switch">
          <input 
            type="checkbox" 
            :checked="showOnlyFailed"
            @change="(e) => emit('update:showOnlyFailed', (e.target as HTMLInputElement).checked)"
          />
          <span class="slider round"></span>
          <span class="label-text">Show Only Failed</span>
        </label>
      </div>
    </div>
    
    <div class="scroll-x">
      <table>
        <thead>
          <tr>
            <th @click="emit('toggle-sort', 'id')" class="sortable">Event ID</th>
            <th @click="emit('toggle-sort', 'name')" class="sortable">Fixture</th>
            <th @click="emit('toggle-sort', 'league')" class="sortable">League</th>
            <th @click="emit('toggle-sort', 'leagueId')" class="sortable">League ID</th>
            <th v-for="fieldName in uniqueFields" 
                :key="fieldName" 
                @click="emit('toggle-sort', 'field:' + fieldName)"
                class="sortable text-center"
            >
              {{ fieldName }}
            </th>
            <th @click="emit('toggle-sort', 'passed')" class="sortable">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredTableData" :key="row.id" :class="{ 'row-fail': !row.passed }">
            <td class="text-bold">{{ row.id }}</td>
            <td>{{ row.name }}</td>
            <td><span class="league-pill">{{ row.league }}</span></td>
            <td><span class="league-pill">{{ row.leagueId }}</span></td>
            <td v-for="fieldName in uniqueFields" :key="fieldName" class="text-center">
              <span class="field-val">{{ row.fields[fieldName] }}</span>
            </td>
            <td>
              <span :class="['status-badge', row.passed ? 'status-pass' : 'status-fail']">
                {{ row.passed ? 'PASSED' : 'FAILED' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-section {
  padding: 0;
  overflow: hidden;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.table-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #1e293b;
}

.table-header p {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.scroll-x {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  font-weight: 700;
  border-bottom: 1px solid #e2e8f0;
}

.sortable { cursor: pointer; }
.sortable:hover { color: #6366f1; }

td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
  color: #334155;
}

.text-bold { font-weight: 600; }
.text-center { text-align: center; }

.league-pill {
  background: #f1f5f9;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #475569;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.025em;
}

.status-pass { background: #d1fae5; color: #065f46; }
.status-fail { background: #fee2e2; color: #991b1b; }

.row-fail { background-color: #fffafb; }

/* Switch Toggle */
.switch { position: relative; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: relative; width: 36px; height: 20px;
  background-color: #cbd5e1;
  transition: .4s; border-radius: 34px;
}
.slider:before {
  position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px;
  background-color: white; transition: .4s; border-radius: 50%;
}
input:checked + .slider { background-color: #6366f1; }
input:checked + .slider:before { transform: translateX(16px); }
.label-text { font-size: 0.85rem; font-weight: 600; color: #64748b; }
</style>
