<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface Batch {
  id: string;
  name: string;
  origin: string;
  lot: string;
  producer: string;
  kgReceived: number;
  kgRoasted: number;
  kgShipped: number;
  status: 'available' | 'in_roast' | 'shipped' | 'quarantine';
  updatedAt: string;
}

interface Sourcing {
  id: string;
  producer: string;
  country: string;
  region: string;
  quality: string;
  premium: number;
  status: 'active' | 'pending' | 'closed';
  volume: number;
}

interface Order {
  id: string;
  customer: string;
  type: string;
  value: number;
  status: 'pending' | 'processing' | 'shipped' | 'fulfilled';
  qty: number;
  updatedAt: string;
}

function hydrate<T extends Record<string, unknown>>(data: T, keys: (keyof T)[]) {
  return Object.fromEntries(
    Object.entries(data).filter(([k]) => keys.includes(k as keyof T))
  ) as Partial<T>;
}

const batches = ref<Batch[]>([]);
const sourcing = ref<Sourcing[]>([]);
const orders = ref<Order[]>([]);
const loading = ref(true);
const exportTarget = ref<'inventory' | 'sourcing' | 'orders'>('inventory');

const statuses = {
  available: 'Ready for roast',
  in_roast: 'In roast',
  shipped: 'Shipped',
  quarantine: 'Quarantine',
} as const;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function statusLabel(status: string) {
  return statuses[status as keyof typeof statuses] ?? status;
}

function statusVariant(status: string) {
  return `status-${status}`;
}

onMounted(async () => {
  try {
    const res = await fetch('/api/operations');
    if (!res.ok) throw new Error(`server ${res.status}`);
    const json = await res.json();
    const data = json.data ?? json;
    batches.value = hydrate(data.batches ?? [], ['id', 'name', 'origin', 'lot', 'producer', 'kgReceived', 'kgRoasted', 'kgShipped', 'status', 'updatedAt']) as Batch[];
    sourcing.value = hydrate(data.sourcing ?? [], ['id', 'producer', 'country', 'region', 'quality', 'premium', 'status', 'volume']) as Sourcing[];
    orders.value = hydrate(data.orders ?? [], ['id', 'customer', 'type', 'value', 'status', 'qty', 'updatedAt']) as Order[];
  } catch (err) {
    batches.value = seedBatches();
    sourcing.value = seedSourcing();
    orders.value = seedOrders();
  } finally {
    loading.value = false;
  }
});

function seedBatches() {
  const now = new Date().toISOString();
  return [
    { id: 'B-1042', name: 'Ethiopia Yirgacheffe Natural', origin: 'Ethiopia', lot: 'GJI-26', producer: 'Hagere Mariam WS', kgReceived: 120, kgRoasted: 0, kgShipped: 0, status: 'available', updatedAt: now },
    { id: 'B-1043', name: 'Kenya Kahawa III Washed', origin: 'Kenya', lot: 'NYE-41', producer: 'Kiangari Co-op', kgReceived: 90, kgRoasted: 24, kgShipped: 0, status: 'in_roast', updatedAt: now },
    { id: 'B-1044', name: 'Colombia Huila Honey', origin: 'Colombia', lot: 'HUI-19', producer: 'Finca El Paraíso', kgReceived: 140, kgRoasted: 0, kgShipped: 0, status: 'available', updatedAt: now },
    { id: 'B-1045', name: 'Sumatra Mandheling Giling Basah', origin: 'Indonesia', lot: 'SUM-03', producer: 'Tonggolitang Co-op', kgReceived: 200, kgRoasted: 0, kgShipped: 200, status: 'shipped', updatedAt: now },
  ];
}

function seedSourcing() {
  return [
    { id: 'S-22', producer: 'Hagere Mariam Washing Station', country: 'Ethiopia', region: 'Guji', quality: '84–86', premium: 0.065, status: 'active', volume: 120 },
    { id: 'S-23', producer: 'Kiangari Farmers Cooperative', country: 'Kenya', region: 'Nyeri', quality: '86–88', premium: 0.058, status: 'active', volume: 90 },
    { id: 'S-24', producer: 'Finca El Paraíso', country: 'Colombia', region: 'Huila', quality: '87–89', premium: 0.072, status: 'pending', volume: 0 },
    { id: 'S-25', producer: 'Tonggolitang Cooperative', country: 'Indonesia', region: 'North Sumatra', quality: '83–85', premium: 0.054, status: 'active', volume: 200 },
  ];
}

function seedOrders() {
  return [
    { id: 'O-3381', customer: 'Third Wave Lab', type: 'Wholesale', value: 4120.0, status: 'pending', qty: 120, updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
    { id: 'O-3382', customer: 'Metro Coffee', type: 'Retail', value: 1860.0, status: 'processing', qty: 75, updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { id: 'O-3383', customer: 'Café La Silla', type: 'Wholesale', value: 6280.0, status: 'processing', qty: 240, updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'O-3384', customer: 'Brew Society', type: 'Membership', value: 3240.0, status: 'fulfilled', qty: 180, updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  ];
}
</script>

<template>
  <section class="ops-layout anim-fade-in">
    <aside class="panel-side">
      <div class="panel glass">
        <div class="panel-head">
          <span class="panel-title">Inventory</span>
          <a class="panel-link" href="/export/overview.csv">Export CSV &rarr;</a>
        </div>
        <div class="batch-table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Lot</th>
                <th>Origin</th>
                <th>Received</th>
                <th>Roasted</th>
                <th>Shipped</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="batch in batches" :key="batch.id" :class="['batch-row', statusVariant(batch.status)]">
                <td>{{ batch.lot }}</td>
                <td>{{ batch.origin }}</td>
                <td class="num">{{ batch.kgReceived }}</td>
                <td class="num">{{ batch.kgRoasted }}</td>
                <td class="num">{{ batch.kgShipped }}</td>
                <td><span :class="['status-badge', statusVariant(batch.status)]">{{ statusLabel(batch.status) }}</span></td>
                <td class="num">{{ formatDate(batch.updatedAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </aside>

    <div class="ops-body">
      <div class="ops-hero glass">
        <div class="ops-hero-left">
          <p class="section-eyebrow">Operations · Live batch data</p>
          <h1 class="section-title">Batch inventory &amp; sourcing health</h1>
          <p class="text-secondary">Direct-trade metrics reset each cycle; downloads are immutable snapshots exported server-side.</p>
        </div>
        <div class="ops-hero-stats">
          <div class="ops-hero-stat">
            <span class="ops-value" data-counter>{{ batches.length }}</span>
            <span class="ops-sub">active batches</span>
          </div>
          <div class="ops-hero-stat">
            <span class="ops-value" data-counter>{{ sourcing.filter((s) => s.status === 'active').length }}</span>
            <span class="ops-sub">open sourcing relationships</span>
          </div>
          <div class="ops-hero-stat">
            <span class="ops-value" data-counter>{{ orders.filter((o) => o.status === 'pending' || o.status === 'processing').length }}</span>
            <span class="ops-sub">orders in queue</span>
          </div>
        </div>
      </div>

      <div class="ops-columns">
        <div class="panel glass">
          <div class="panel-head">
            <span class="panel-title">Sourcing pipelines</span>
            <a class="panel-link" href="/sourcing">Open all &rarr;</a>
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
                <tr v-for="s in sourcing" :key="s.id">
                  <td>{{ s.producer }}</td>
                  <td>{{ s.country }}</td>
                  <td>{{ s.region }}</td>
                  <td>{{ s.quality }}</td>
                  <td class="num">{{ (s.premium * 100).toFixed(1) }}%</td>
                  <td class="num">{{ s.volume }}</td>
                  <td><span :class="['status-badge', `status-${s.status}`]">{{ s.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="panel glass">
          <div class="panel-head">
            <span class="panel-title">Wholesale order queue</span>
            <span class="panel-count">{{ orders.filter((o) => o.status === 'pending' || o.status === 'processing').length }} pending</span>
          </div>
          <div class="order-table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Channel</th>
                  <th>Value</th>
                  <th>Qty (kg)</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.customer }}</td>
                  <td>{{ order.type }}</td>
                  <td class="num">${{ order.value.toFixed(2) }}</td>
                  <td class="num">{{ order.qty }}</td>
                  <td><span :class="['status-badge', `status-${order.status}`]">{{ order.status }}</span></td>
                  <td class="num">{{ formatDate(order.updatedAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'Dashboard' });
</script>

<style scoped>
.ops-layout {
  display: grid;
  grid-template-columns: 390px 1fr;
  gap: 1.5rem;
  align-items: start;
}

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
  color: var(--text-primary);
}

.panel-link,
.panel-count {
  font-size: 0.8rem;
  color: var(--cyan);
  text-decoration: none;
  font-weight: 600;
}

.panel-link:hover,
.panel-count:hover {
  text-decoration: underline;
}

.batch-table-wrap,
.source-table-wrap,
.order-table-wrap {
  overflow-x: auto;
  max-height: 460px;
  overflow-y: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.table th {
  text-align: left;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 0.6rem 0.7rem;
  border-bottom: 1px solid var(--border);
}

.table td {
  padding: 0.7rem;
  border-bottom: 1px solid rgba(34, 211, 238, 0.12);
  color: var(--text-secondary);
  white-space: nowrap;
}

.table tbody tr:hover {
  background: rgba(34, 211, 238, 0.05);
}

.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
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
  background: rgba(248, 113, 113, 0.12);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
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

.ops-body {
  display: grid;
  gap: 1.25rem;
}

.ops-hero {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 1.25rem;
  align-items: center;
  padding: 1.5rem;
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
  font-size: 1.6rem;
  color: #22d3ee;
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

@media (max-width: 620px) {
  .panel-side {
    display: none;
  }
  .ops-hero {
    grid-template-columns: 1fr;
  }
  .ops-hero-stats {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
