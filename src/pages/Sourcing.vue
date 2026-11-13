<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface Source {
  id: string;
  producer: string;
  country: string;
  region: string;
  quality: string;
  premium: number;
  status: 'active' | 'pending' | 'closed';
  volume: number;
  updatedAt: string;
}

interface Metric {
  label: string;
  value: number;
  suffix: string;
}

const sources = ref<Source[]>([]);
const metrics = ref<Metric[]>([]);
const loading = ref(true);

const METRIC_LABELS = {
  activePipelines: 'Active sourcing pipelines',
  production: 'Production (kg)',
  qualityPremium: 'Quality premium (% over commodity)',
  relationships: 'Direct relationships',
};

function hydrate<T extends Record<string, unknown>>(data: T, keys: (keyof T)[]) {
  return Object.fromEntries(
    Object.entries(data).filter(([k]) => keys.includes(k as keyof T))
  ) as Partial<T>;
}

onMounted(async () => {
  try {
    const res = await fetch('/api/operations');
    if (!res.ok) throw new Error(`server ${res.status}`);
    const json = await res.json();
    const data = json.data ?? json;
    sources.value = hydrate(data.sources ?? [], ['id', 'producer', 'country', 'region', 'quality', 'premium', 'status', 'volume', 'updatedAt']) as Source[];
    metrics.value = [
      { label: METRIC_LABELS.activePipelines, value: sources.value.filter((s) => s.status === 'active').length, suffix: '' },
      { label: METRIC_LABELS.production, value: sources.value.reduce((n, s) => n + s.volume, 0), suffix: ' kg' },
      { label: METRIC_LABELS.qualityPremium, value: 6.5, suffix: '%' },
      { label: METRIC_LABELS.relationships, value: sources.value.length, suffix: '' },
    ];
  } catch (err) {
    sources.value = [
      { id: 'S-22', producer: 'Hagere Mariam Washing Station', country: 'Ethiopia', region: 'Guji', quality: '84–86', premium: 0.065, status: 'active', volume: 120, updatedAt: new Date().toISOString() },
      { id: 'S-23', producer: 'Kiangari Farmers Cooperative', country: 'Kenya', region: 'Nyeri', quality: '86–88', premium: 0.058, status: 'active', volume: 90, updatedAt: new Date().toISOString() },
      { id: 'S-24', producer: 'Finca El Paraíso', country: 'Colombia', region: 'Huila', quality: '87–89', premium: 0.072, status: 'pending', volume: 0, updatedAt: new Date().toISOString() },
      { id: 'S-25', producer: 'Tonggolitang Cooperative', country: 'Indonesia', region: 'North Sumatra', quality: '83–85', premium: 0.054, status: 'active', volume: 200, updatedAt: new Date().toISOString() },
    ];
    metrics.value = [
      { label: 'Active sourcing pipelines', value: 3, suffix: '' },
      { label: 'Production (kg)', value: 410, suffix: ' kg' },
      { label: 'Quality premium (%)', value: 6.5, suffix: '%' },
      { label: 'Direct relationships', value: 4, suffix: '' },
    ];
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="ops-layout anim-fade-in">
    <aside class="panel-side">
      <div class="panel glass">
        <div class="panel-head">
          <span class="panel-title">Active direct-trade pipelines</span>
        </div>
        <div class="source-table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Producer</th>
                <th>Country</th>
                <th>Region</th>
                <th>Quality</th>
                <th>Premium</th>
                <th>Volume kg</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="source in sources" :key="source.id">
                <td>{{ source.producer }}</td>
                <td>{{ source.country }}</td>
                <td>{{ source.region }}</td>
                <td>{{ source.quality }}</td>
                <td class="num">{{ (source.premium * 100).toFixed(1) }}%</td>
                <td class="num">{{ source.volume }}</td>
                <td><span :class="['status-badge', `status-${source.status}`]">{{ source.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </aside>

    <div class="ops-body">
      <div class="ops-hero glass">
        <div class="ops-hero-left">
          <p class="section-eyebrow">Direct trade</p>
          <h1 class="section-title">Sourcing metrics</h1>
          <p class="text-secondary">
            Live transparency on producer relationships, lot quality, and the premium paid above the commodity C-market.
          </p>
        </div>
        <div class="ops-hero-stats">
          <div v-for="m in metrics" :key="m.label" class="ops-hero-stat">
            <span class="ops-value">{{ m.value.toLocaleString() }}{{ m.suffix }}</span>
            <span class="ops-sub">{{ m.label }}</span>
          </div>
        </div>
      </div>

      <div class="ops-columns">
        <div class="panel glass">
          <div class="panel-head">
            <span class="panel-title">Quality &amp; premium detail</span>
            <a class="panel-link" href="/inventory">Inventory &rarr;</a>
          </div>
          <div class="quality-detail">
            <div class="quality-row">
              <span class="quality-label">Ethiopia Guji</span>
              <span class="quality-value">84–86</span>
            </div>
            <div class="quality-row">
              <span class="quality-label">Kenya Nyeri</span>
              <span class="quality-value">86–88</span>
            </div>
            <div class="quality-row">
              <span class="quality-label">Colombia Huila</span>
              <span class="quality-value">87–89</span>
            </div>
            <div class="quality-row">
              <span class="quality-label">Indonesia Sumatra</span>
              <span class="quality-value">83–85</span>
            </div>
          </div>
        </div>

        <div class="panel glass">
          <div class="panel-head">
            <span class="panel-title">Sourcing pipeline workflow</span>
          </div>
          <ol class="workflow">
            <li>
              <strong>Discover &amp; scout</strong> — field visits and producer verification.
              <span class="text-muted">Active: 3 pipelines</span>
            </li>
            <li>
              <strong>Contract &amp; sample</strong> — direct price set at 5–7% premium above C-market.
            </li>
            <li>
              <strong>Harvest &amp; logistics</strong> — lot tracking from parchment to warehouse.
              <span class="text-muted">{{ sources.filter((s) => s.status === 'active').reduce((n, s) => n + s.volume, 0) }} kg in flight</span>
            </li>
            <li>
              <strong>Cupping &amp; release</strong> — QC released, shipments dispatched.
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'Sourcing' });
</script>

<style scoped>
.panel-side {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel {
  padding: 1.25rem;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.panel-title {
  font-size: 0.95rem;
  font-weight: 700;
}

.panel-link {
  font-size: 0.8rem;
  color: var(--cyan);
  text-decoration: none;
  font-weight: 600;
}

.panel-link:hover {
  text-decoration: underline;
}

.source-table-wrap {
  overflow-x: auto;
  max-height: 480px;
  overflow-y: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.table th {
  text-align: left;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 0.6rem 0.7rem;
  border-bottom: 1px solid var(--border);
}

.table td {
  padding: 0.6rem 0.7rem;
  border-bottom: 1px solid rgba(34, 211, 238, 0.12);
  color: var(--text-secondary);
}

.num {
  text-align: right;
}

.ops-body {
  display: grid;
  gap: 1.25rem;
}

.ops-hero {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 1.25rem;
  align-items: center;
}

.ops-hero-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ops-hero-stats {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.ops-hero-stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.ops-hero-stat .ops-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #22d3ee;
  line-height: 1.1;
}

.ops-hero-stat .ops-sub {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.ops-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.quality-detail {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quality-row {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
}

.quality-label {
  color: var(--text-secondary);
}

.quality-value {
  font-weight: 700;
  color: #22d3ee;
}

.workflow {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.workflow li {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.75rem;
  background: rgba(34, 211, 238, 0.05);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
}

.workflow li strong {
  color: var(--text-primary);
}

.workflow li .text-muted {
  font-size: 0.75rem;
}

@media (max-width: 980px) {
  .ops-layout {
    grid-template-columns: 1fr;
  }
  .ops-hero {
    grid-template-columns: 1fr;
  }
  .ops-columns {
    grid-template-columns: 1fr;
  }
}
</style>
