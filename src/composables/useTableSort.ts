import { ref, computed, type Ref } from 'vue';
import type { AnalysisResults } from './useCsvProcessor';

export function useTableSort(analysisResults: Ref<AnalysisResults | null>, showOnlyFailed: Ref<boolean>) {
  const sortKey = ref<string>('id');
  const sortOrder = ref<'asc' | 'desc'>('asc');

  const toggleSort = (key: string) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortOrder.value = 'asc';
    }
  };

  const filteredTableData = computed(() => {
    if (!analysisResults.value) return [];
    
    let data = [...analysisResults.value.tableData];
    
    if (showOnlyFailed.value) {
      data = data.filter((row: any) => !row.passed);
    }

    return data.sort((a: any, b: any) => {
      let aVal, bVal;
      
      if (sortKey.value.startsWith('field:')) {
        const fieldName = sortKey.value.split(':')[1];
        aVal = a.fields[fieldName];
        bVal = b.fields[fieldName];
      } else {
        aVal = a[sortKey.value];
        bVal = b[sortKey.value];
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  });

  return {
    sortKey,
    sortOrder,
    toggleSort,
    filteredTableData
  };
}
