import { ref } from 'vue';
import Papa from 'papaparse';
import type { AppSettings } from '../settings';

export interface AnalysisResults {
  totalRows: number;
  matchedCount: number;
  passedCount: number;
  failedCount: number;
  tableData: any[];
  percentMatched: string;
  percentFailedInMatched: string;
  percentPassed: string;
  percentMissing: string;
  percentPartial: string;
  percentOver: string;
  missingMatchCount: number;
  partialMatchCount: number;
  overMatchCount: number;
  chart1Data: { labels: string[], datasets: any[] };
  chart2Data: { labels: string[], datasets: any[] };
  chart3Data: { labels: string[], datasets: any[] };
  chart4Data: { labels: string[], datasets: any[] };
}

export function useCsvProcessor(settings: AppSettings) {
  const csvFile = ref<File | null>(null);
  const analysisResults = ref<AnalysisResults | null>(null);
  const isAnalyzing = ref(false);

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      csvFile.value = target.files[0];
    }
  };

  const processResults = (data: any[]) => {
    const totalRows = data.length;
    const leagueIdColumn = 'League.Id';
    const selectedIdsSet = new Set(settings.leagueIds.map(id => String(id)));

    const matchedRows = data.filter(row => selectedIdsSet.has(String(row[leagueIdColumn])));
    const matchedCount = matchedRows.length;
    
    let missingCount = 0;
    let partialCount = 0;
    let overCount = 0;

    const metCriteriaRows = matchedRows.filter(row => {
      const results = settings.analysisFields.map(field => {
        const val = parseFloat(row[field.columnHeader]);
        if (isNaN(val)) return false;
        
        switch (field.operator) {
          case '<': return val < field.value;
          case '>': return val > field.value;
          case '==': return val == field.value;
          default: return false;
        }
      });

      const criteriaMet = settings.logicOperator === 'OR' 
        ? results.some(r => r === true)
        : results.every(r => r === true);

      if (criteriaMet) {
        const isMissing = settings.analysisFields.some(field => parseFloat(row[field.columnHeader]) === 0);
        
        const isOver = settings.analysisFields.some(field => {
          const val = parseFloat(row[field.columnHeader]);
          return field.operator === '>' && val > field.value;
        });

        if (isMissing) {
          missingCount++;
        } else if (isOver) {
          overCount++;
        } else {
          partialCount++;
        }
      }

      return criteriaMet;
    });

    const failedCount = metCriteriaRows.length;
    const passedCount = matchedCount - failedCount;
    
    const tableData = matchedRows.map(row => {
      const details: Record<string, any> = {
        id: row['Id'],
        name: row['Name'],
        league: row['League.Name'],
        leagueId: row['League.Id'],
        fields: {} as Record<string, number>,
        passed: false
      };

      const fieldResults = settings.analysisFields.map(field => {
        const val = parseFloat(row[field.columnHeader]);
        details.fields[field.columnHeader] = isNaN(val) ? 0 : val;
        
        if (isNaN(val)) return false;
        switch (field.operator) {
          case '<': return val < field.value;
          case '>': return val > field.value;
          case '==': return val == field.value;
          default: return false;
        }
      });

      const criteriaMet = settings.logicOperator === 'OR' 
        ? fieldResults.some(r => r === true)
        : fieldResults.every(r => r === true);

      details.passed = !criteriaMet;

      return details;
    });

    const leagueCounts: Record<string, number> = {};
    matchedRows.forEach(row => {
      const lid = row['League.Name'] || row['League.Id'] || 'Unknown';
      leagueCounts[lid] = (leagueCounts[lid] || 0) + 1;
    });

    const sortedLeagues = Object.keys(leagueCounts)
      .map(key => ({ label: key, count: leagueCounts[key] }))
      .sort((a, b) => b.count - a.count);

    analysisResults.value = {
      totalRows,
      matchedCount,
      passedCount,
      failedCount,
      tableData,
      percentMatched: ((matchedCount / totalRows) * 100).toFixed(2),
      percentFailedInMatched: matchedCount > 0 ? ((failedCount / matchedCount) * 100).toFixed(2) : '0.00',
      percentPassed: matchedCount > 0 ? ((passedCount / matchedCount) * 100).toFixed(2) : '0.00',
      percentMissing: failedCount > 0 ? ((missingCount / failedCount) * 100).toFixed(2) : '0.00',
      percentPartial: failedCount > 0 ? ((partialCount / failedCount) * 100).toFixed(2) : '0.00',
      percentOver: failedCount > 0 ? ((overCount / failedCount) * 100).toFixed(2) : '0.00',
      missingMatchCount: missingCount,
      partialMatchCount: partialCount,
      overMatchCount: overCount,
      chart1Data: {
        labels: ['Matched IDs', 'Other IDs'],
        datasets: [{
          backgroundColor: ['#6366f1', '#e2e8f0'],
          data: [matchedCount, totalRows - matchedCount]
        }]
      },
      chart2Data: {
        labels: ['Failed (Criteria Met)', 'Passed'],
        datasets: [{
          backgroundColor: ['#ef4444', '#10b981'],
          data: [failedCount, passedCount]
        }]
      },
      chart3Data: {
        labels: ['Missing (0)', 'Partial (>0)', 'Over (> Set)'],
        datasets: [{
          backgroundColor: ['#f97316', '#eab308', '#a855f7'],
          data: [missingCount, partialCount, overCount]
        }]
      },
      chart4Data: {
        labels: sortedLeagues.map(s => s.label).slice(0, 15), // Show top 15 leagues
        datasets: [{
          label: 'Matches',
          backgroundColor: '#3b82f6',
          data: sortedLeagues.map(s => s.count).slice(0, 15)
        }]
      }
    };
  };

  const analyze = () => {
    if (!csvFile.value) return;

    isAnalyzing.value = true;
    Papa.parse(csvFile.value, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processResults(results.data as any[]);
        isAnalyzing.value = false;
      },
      error: (error: any) => {
        console.error('CSV Parsing Error:', error);
        alert('Error parsing CSV file.');
        isAnalyzing.value = false;
      }
    });
  };

  const resetAnalysis = () => {
    analysisResults.value = null;
    csvFile.value = null;
  };

  return {
    csvFile,
    analysisResults,
    isAnalyzing,
    handleFileUpload,
    analyze,
    resetAnalysis
  };
}
