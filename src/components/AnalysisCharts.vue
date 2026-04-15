<script setup lang="ts">
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Doughnut, Bar } from 'vue-chartjs';
import type { AnalysisResults } from '../composables/useCsvProcessor';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

defineProps<{
  results: AnalysisResults;
}>();

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20
      }
    }
  }
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: { beginAtZero: true }
  }
};
</script>

<template>
  <div class="charts-grid relative-grid">
    <div class="chart-container card">
      <h4>ID Coverage</h4>
      <div class="chart-wrapper">
        <Pie :data="results.chart1Data" :options="chartOptions" />
      </div>
    </div>
    <div class="chart-container card">
      <h4>Integrity Check</h4>
      <div class="chart-wrapper">
        <Pie :data="results.chart2Data" :options="chartOptions" />
      </div>
    </div>
    <div class="chart-container card">
      <h4>Issue Mix</h4>
      <div class="chart-wrapper">
        <Doughnut :data="results.chart3Data" :options="chartOptions" />
      </div>
    </div>
    <div class="chart-container card">
      <h4>Matches per League (Top 15)</h4>
      <div class="chart-wrapper">
        <Bar :data="results.chart4Data" :options="barOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-container {
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.chart-container h4 {
  margin: 0 0 1.5rem;
  font-size: 1.1rem;
  color: #334155;
  text-align: center;
}

.chart-wrapper {
  height: 250px;
}

@media (max-width: 768px) {
  .charts-grid { grid-template-columns: 1fr; }
}
</style>
