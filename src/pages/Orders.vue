<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface Order {
  id: string;
  customer: string;
  type: string;
  value: number;
  status: 'pending' | 'processing' | 'shipped' | 'fulfilled';
  qty: number;
  updatedAt: string;
}

const orders = ref<Order[]>([]);
const loading = ref(true);

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
    orders.value = hydrate(json.data?.orders ?? [], ['id', 'customer', 'type', 'value', 'status', 'qty', 'updatedAt']) as Order[];
  } catch (err) {
    orders.value = [
      { id: 'O-3381', customer: 'Third Wave Lab', type: 'Wholesale', value: 4120.0, status: 'pending', qty: 120, updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
      { id: 'O-3382', customer: 'Metro Coffee', type: 'Retail', value: 1860.0, status: 'processing', qty: 75, updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
      { id: 'O-3383', customer: 'Café La Silla', type: 'Wholesale', value: 6280.0, status: 'processing', qty: 240, updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      { id: 'O-3384', customer: 'Brew Society', type: 'Membership', value: 3240.0, status: 'fulfilled', qty: 180, updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
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
          <span class="panel-title">Wholesale order queues</span>
          <span class="status-chip">{{ orders.filter((o) => o.status === 'pending' || o.status === 'processing').length }} active</span>
        </div>
        <div class="order-table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Channel</th>
                <th>Value</th>
                <th>Qty kg</th>
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
                <td class="num">{{ new Date(order.updatedAt).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="ops-body">
      <div class="ops-hero glass">
        <div class="ops-hero-left">
          <p class="section-eyebrow">Wholesale queue</p>
          <h1 class="section-title">Order management</h1>
          <p class="text-secondary">
            Direct-trade runs on multi-channel wholesale. Consistent format, pure-save CSV export, and immutable order state.
          </p>
        </div>
        <div class="ops-hero-stats">
          <div class="ops-hero-stat">
            <span class="ops-value">{{ orders.filter((o) => o.status === 'pending').length }}</span>
            <span class="ops-sub">pending</span>
          </div>
          <div class="ops-hero-stat">
            <span class="ops-value">{{ orders.filter((o) => o.status === 'processing').length }}</span>
            <span class="ops-sub">processing</span>
          </div>
          <div class="ops-hero-stat">
            <span class="ops-value">{{ orders.filter((o) => o.status === 'fulfilled').length }}</span>
            <span class="ops-sub">fulfilled</span>
          </div>
        </div>
      </div>

      <div class="panel glass">
        <div class="panel-head">
          <span class="panel-title">Current queue</span>
        </div>
        <div class="order-detail">
          <div v-for="order in orders" :key="order.id" class="order-row">
            <div class="order-row-main">
              <span class="order-id">{{ order.id }}</span>
              <span class="order-customer">{{ order.customer }}</span>
              <span class="order-channel">{{ order.type }}</span>
            </div>
            <div class="order-row-meta">
              <span class="num">{{ order.qty }} kg</span>
              <span class="num">${{ order.value.toFixed(2) }}</span>
              <span :class="['status-badge', `status-${order.status}`]">{{ order.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel glass">
        <div class="panel-head">
          <span class="panel-title">Queue controls</span>
        </div>
        <div class="queue-actions">
          <button class="btn btn-primary">Mark processing &rarr;</button>
          <button class="btn btn-ghost">Archive fulfilled &rarr;</button>
          <button class="btn btn-ghost" @click="exportCsv()">
            <span class="spinner" v-if="exporting"></span>
            <span v-if="!exporting">Export CSV to download &rarr;</span>
          </button>
        </div>
        <p class="text-muted">
          Export is a pure file snapshot: the same rows, same format, every cycle.
          No server-side mutation is performed by the export itself.
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'Orders' });
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

.status-chip {
  font-size: 0.78rem;
  font-weight: 700;
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.18);
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
}

.order-table-wrap {
  overflow-x: auto;
  max-height: 460px;
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

.order-detail {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.order-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding: 0.85rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  flex-wrap: wrap;
}

.order-row-main {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.order-id {
  font-weight: 700;
  color: var(--text-primary);
}

.order-customer {
  font-weight: 600;
  color: var(--cyan);
}

.order-channel {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.order-row-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.queue-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
}

@media (max-width: 900px) {
  .ops-layout {
    grid-template-columns: 1fr;
  }
  .ops-hero {
    grid-template-columns: 1fr;
  }
}
</style>
