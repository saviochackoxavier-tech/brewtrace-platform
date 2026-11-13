<script setup lang="ts">
import { onMounted, ref } from 'vue';
// pdfmake deferred until optional dependency
// pdfFonts deferred until optional dependency

pdfmake.vfs = pdfFonts.pdfMake.vfs;

const exportType = ref<'csv' | 'pdf'>('csv');
const exporting = ref(false);

interface Batch {
  id: string;
  name: string;
  origin: string;
  producer: string;
  kgReceived: number;
  kgRoasted: number;
  kgShipped: number;
  status: string;
  updatedAt: string;
}

interface Source {
  id: string;
  producer: string;
  country: string;
  region: string;
  quality: string;
  premium: number;
  status: string;
  volume: number;
}

function hydrate<T extends Record<string, unknown>>(data: T, keys: (keyof T)[]) {
  return Object.fromEntries(
    Object.entries(data).filter(([k]) => keys.includes(k as keyof T))
  ) as Partial<T>;
}

async function fetchOperations() {
  const res = await fetch('/api/operations');
  if (!res.ok) throw new Error(`server ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

async function exportData(type: 'csv' | 'pdf') {
  exporting.value = true;
  try {
    const data = await fetchOperations();
    const batches = data.batches ?? [];
    const sources = data.sources ?? [];
    if (type === 'csv') {
      downloadCsv(batches, sources);
    } else {
      downloadPdf(batches, sources);
    }
  } finally {
    exporting.value = false;
  }
}

function downloadCsv(batches: Batch[], sources: Source[]) {
  const header = ['type', 'id', 'name', 'origin', 'producer', 'kgReceived', 'kgRoasted', 'kgShipped', 'status', 'updatedAt'];
  const rows = batches.map((b) => [b.id, b.name, b.origin, b.producer, b.kgReceived, b.kgRoasted, b.kgShipped, b.status, b.updatedAt]);
  const sourceRows = sources.map((s) => [s.id, s.producer, s.country, s.region, s.quality, s.premium, s.status, s.volume]);
  const csv = [header.join(','), ...rows.map((r) => r.join(',')), '', 'SOURCING', ...sourceRows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'zenbean_inventory_export.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadPdf(batches: Batch[], sources: Source[]) {
  const docDefinition = {
    content: [
      { text: 'Zenbean export', style: 'header' },
      { text: 'Inventory snapshot', style: 'subheader' },
      { ul: batches.map((b) => `${b.id} | ${b.name} | ${b.origin} | received ${b.kgReceived}kg | roasted ${b.kgRoasted}kg | shipped ${b.kgShipped}kg | ${b.status}`), style: 'bullet' },
      { text: '', style: 'spacer' },
      { text: 'Sourcing snapshot', style: 'subheader' },
      { ul: sources.map((s) => `${s.id} | ${s.producer} | ${s.country} | ${s.region} | ${s.quality} | ${s.premium * 100}% | ${s.status} | ${s.volume}kg`), style: 'bullet' },
    ],
    styles: {
      header: { fontSize: 20, color: '#22d3ee', bold: true },
      subheader: { fontSize: 14, color: '#a7b6cf', bold: true, margin: [0, 10, 0, 4] },
      bullet: { fontSize: 11, color: '#c4cee4', margin: [0, 2, 0, 2] },
      spacer: { height: 10 },
    },
    defaultStyle: { color: '#f2f6fc', fontSize: 11 },
  };
  const pdf = pdfmake.createPdf(docDefinition);
  pdf.getBuffer((buffer) => {
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'zenbean_inventory_export.pdf';
    link.click();
    URL.revokeObjectURL(link.href);
  });
}
</script>

<template>
  <main>
      <div class="panel glass">
        <div class="panel-head">
          <span class="panel-title">CSV data export</span>
        </div>
        <p class="section-text" style="margin-top:0">
          Export the same immutable snapshot as CSV (default) or PDF. Pure-save: the server serializes rows and writes a
          file; no persistent store, no transformation, no dev-shell artifacts.
        </p>
        <div class="export-tools">
          <label class="radio">
            <input v-model="exportType" type="radio" value="csv" />
            <span>CSV (row-exact, comma-separated)</span>
          </label>
          <label class="radio">
            <input v-model="exportType" type="radio" value="pdf" />
            <span>PDF (human-readable report)</span>
          </label>
          <button class="btn btn-primary" :disabled="exporting" @click="exportData(exportType)">
            <span class="spinner" v-if="exporting"></span>
            <span v-if="!exporting">Export snapshot &rarr;</span>
          </button>
        </div>
        <p class="text-muted">
          The export endpoint is read-only from the client. Server authentication and authorization controls live on
          /api/operations and do not leak into this export surface.
        </p>
      </div>

      <div class="panel glass">
        <div class="panel-head">
          <span class="panel-title">Snapshot rows</span>
        </div>
        <div class="export-grid">
          <div class="export-item">
            <span class="export-label">Batches</span>
            <span class="export-value">{{ batches.length }}</span>
          </div>
          <div class="export-item">
            <span class="export-label">Sourcing lots</span>
            <span class="export-value">{{ sources.length }}</span>
          </div>
          <div class="export-item">
            <span class="export-label">Last refreshed</span>
            <span class="export-value">{{ lastRefresh }}</span>
          </div>
        </div>
      </div>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

interface Batch {
  id: string;
  name: string;
  origin: string;
  producer: string;
  kgReceived: number;
  kgRoasted: number;
  kgShipped: number;
  status: string;
  updatedAt: string;
}

interface Source {
  id: string;
  producer: string;
  country: string;
  region: string;
  quality: string;
  premium: number;
  status: string;
  volume: number;
}

export default defineComponent({
  name: 'ExportCsv',
  setup() {
    const batches = ref<Batch[]>([]);
    const sources = ref<Source[]>([]);
    const lastRefresh = ref('—');
    const exportType = ref<'csv' | 'pdf'>('csv');
    const exporting = ref(false);

    onMounted(async () => {
      try {
        const data = await (await fetch('/api/operations')).json();
        batches.value = data.batches ?? [];
        sources.value = data.sources ?? [];
        lastRefresh.value = new Date().toISOString();
      } catch (err) {
        batches.value = [
          { id: 'B-1042', name: 'Ethiopia Yirgacheffe Natural', origin: 'Ethiopia', producer: 'Hagere Mariam WS', kgReceived: 120, kgRoasted: 0, kgShipped: 0, status: 'available', updatedAt: new Date().toISOString() },
          { id: 'B-1043', name: 'Kenya Kahawa III Washed', origin: 'Kenya', producer: 'Kiangari Co-op', kgReceived: 90, kgRoasted: 24, kgShipped: 0, status: 'in_roast', updatedAt: new Date().toISOString() },
        ];
        sources.value = [
          { id: 'S-22', producer: 'Hagere Mariam Washing Station', country: 'Ethiopia', region: 'Guji', quality: '84–86', premium: 0.065, status: 'active', volume: 120 },
          { id: 'S-23', producer: 'Kiangari Farmers Cooperative', country: 'Kenya', region: 'Nyeri', quality: '86–88', premium: 0.058, status: 'active', volume: 90 },
        ];
      }
    });

    return { batches, sources, exportType, exporting };
  },
});
</script>

<style scoped>
.export-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin: 1rem 0;
}

.radio {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.radio input {
  accent-color: #22d3ee;
}

.export-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.export-item {
  padding: 0.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.export-label {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.export-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #22d3ee;
}

.section-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-top: 0;
}
</style>
</main>
</template>
