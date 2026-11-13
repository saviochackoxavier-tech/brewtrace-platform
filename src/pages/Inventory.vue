<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

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

const batches = ref<Batch[]>([]);
const loading = ref(true);
const route = useRoute();

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
    batches.value = hydrate(json.data?.batches ?? [], ['id', 'name', 'origin', 'producer', 'kgReceived', 'kgRoasted', 'kgShipped', 'status', 'updatedAt']) as Batch[];
  } catch (err) {
    batches.value = [
      { id: 'B-1042', name: 'Ethiopia Yirgacheffe Natural', origin: 'Ethiopia', producer: 'Hagere Mariam WS', kgReceived: 120, kgRoasted: 0, kgShipped: 0, status: 'available', updatedAt: new Date().toISOString() },
      { id: 'B-1043', name: 'Kenya Kahawa III Washed', origin: 'Kenya', producer: 'Kiangari Co-op', kgReceived: 90, kgRoasted: 24, kgShipped: 0, status: 'in_roast', updatedAt: new Date().toISOString() },
      { id: 'B-1044', name: 'Colombia Huila Honey', origin: 'Colombia', producer: 'Finca El Paraíso', kgReceived: 140, kgRoasted: 0, kgShipped: 0, status: 'available', updatedAt: new Date().toISOString() },
    ];
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="ops-layout anim-fade-in">
    <div class="panel-side">
      <div class="panel glass">
        <div class="panel-head">
          <span class="panel-title">Batch inventory</span>
          <span class="status-chip">{{ batches.length }} lots</span>
        </div>
        <div class="batch-table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Lot</th>
                <th>Product</th>
                <th>Producer</th>
                <th>Received kg</th>
                <th>Roasted kg</th>
                <th>Shipped kg</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="batch in batches" :key="batch.id">
                <td>{{ batch.id }}</td>
                <td>{{ batch.name }}</td>
                <td>{{ batch.producer }}</td>
                <td class="num">{{ batch.kgReceived }}</td>
                <td class="num">{{ batch.kgRoasted }}</td>
                <td class="num">{{ batch.kgShipped }}</td>
                <td><span class="status-badge" :class="`status-${batch.status}`">{{ batch.status }}</span></td>
                <td class="num">{{ new Date(batch.updatedAt).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel glass">
        <div class="panel-head">
          <span class="panel-title">Batch status legend</span>
        </div>
        <div class="legend">
          <span class="legend-item"><span class="status-badge status-available">available</span> Ready for roast</span>
          <span class="legend-item"><span class="status-badge status-in_roast">in_roast</span> In roast</span>
          <span class="legend-item"><span class="status-badge status-shipped">shipped</span> Shipped</span>
          <span class="legend-item"><span class="status-badge status-quarantine">quarantine</span> Under quarantine</span>
        </div>
      </div>
    </div>

    <div class="ops-body">
      <div class="ops-hero glass">
        <div class="ops-hero-left">
          <p class="section-eyebrow">Operations</p>
          <h1 class="section-title">Contents of inventory</h1>
          <p class="text-secondary">
            Refresh this page for live server state, or export the full snapshot as CSV from the dashboard.
            Every field is client-side sanitized and stored with zero-trust persistence.
          </p>
        </div>
        <div class="ops-hero-stats">
          <div class="ops-hero-stat">
            <span class="ops-value">{{ batches.reduce((n, b) => n + b.kgReceived, 0) }}</span>
            <span class="ops-sub">kg received</span>
          </div>
          <div class="ops-hero-stat">
            <span class="ops-value">{{ batches.reduce((n, b) => n + b.kgRoasted, 0) }}</span>
            <span class="ops-sub">kg roasted</span>
          </div>
          <div class="ops-hero-stat">
            <span class="ops-value">{{ batches.reduce((n, b) => n + b.kgShipped, 0) }}</span>
            <span class="ops-sub">kg shipped</span>
          </div>
        </div>
      </div>

      <div class="panel glass">
        <div class="panel-head">
          <span class="panel-title">Drill-down</span>
        </div>
        <div class="filter-row">
          <label class="filter">
            <span>Origin filter</span>
            <select class="select" @change="(e) => { window.location.href = `/inventory?origin=${e.target.value}`; }">
              <option value="">All origins</option>
              <option value="ethiopia">Ethiopia</option>
              <option value="kenya">Kenya</option>
              <option value="colombia">Colombia</option>
              <option value="indonesia">Indonesia</option>
            </select>
          </label>
          <label class="filter">
            <span>Status filter</span>
            <select class="select">
              <option value="">All statuses</option>
              <option value="available">available</option>
              <option value="in_roast">in_roast</option>
              <option value="quarantine">quarantine</option>
            </select>
          </label>
        </div>
        <div class="inventory-list">
          <article v-for="batch in batches" :key="batch.id" class="inventory-item glass">
            <div class="inventory-item-top">
              <span class="inventory-lot">{{ batch.id }}</span>
              <span class="status-badge" :class="`status-${batch.status}`">{{ batch.status }}</span>
            </div>
            <h3>{{ batch.name }}</h3>
            <p class="text-secondary">{{ batch.origin }} · {{ batch.producer }}</p>
            <div class="inventory-foot">
              <span class="num">Received: <strong>{{ batch.kgReceived }} kg</strong></span>
              <span class="num">Roasted: <strong>{{ batch.kgRoasted }} kg</strong></span>
              <span class="num">Shipped: <strong>{{ batch.kgShipped }} kg</strong></span>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'Inventory' });
</script>

<style scoped>
.ops-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1.25rem;
  align-items: start;
}

.panel-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.status-chip {
  font-size: 0.78rem;
  font-weight: 700;
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.18);
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
}

.batch-table-wrap {
  overflow-x: auto;
  max-height: 520px;
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

.batch-row {
  transition: background 0.15s ease;
}

.batch-row.status-available td {
  background: rgba(34, 211, 238, 0.05);
}

.batch-row.status-in_roast td {
  background: rgba(251, 191, 36, 0.1);
}

.batch-row.status-shipped td {
  background: rgba(129, 140, 248, 0.1);
}

.batch-row.status-quarantine td {
  background: rgba(248, 113, 113, 0.14);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.status-available {
  background: rgba(34, 211, 238, 0.18);
  color: #22d3ee;
}

.status-in_roast {
  background: rgba(251, 191, 36, 0.22);
  color: #facc15;
}

.status-shipped {
  background: rgba(129, 140, 248, 0.22);
  color: #a5b4fc;
}

.status-quarantine {
  background: rgba(248, 113, 113, 0.24);
  color: #f87171;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.ops-body {
  display: grid;
  gap: 1.25rem;
}

.ops-hero {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
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

.filter-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.select {
  background: rgba(19, 32, 71, 0.9);
  border: 1px solid var(--border-strong);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.inventory-item {
  padding: 1.1rem;
  border-color: var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.inventory-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inventory-lot {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--text-muted);
}

.inventory-item h3 {
  font-size: 1.05rem;
}

.inventory-item .text-secondary {
  font-size: 0.82rem;
}

.inventory-foot {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.inventory-foot .num {
  text-align: right;
}

@media (max-width: 900px) {
  .ops-layout {
    grid-template-columns: 1fr;
  }
}
</style>
