import { offlineDB, OfflineBase } from './offlineDB';

export async function enqueue(table: 'attendance' | 'payments', record: Omit<OfflineBase, 'id' | 'synced' | 'createdAt' | 'updatedAt'>) {
  const now = Date.now();
  console.log('Enqueue to', table, record);
  await offlineDB[table].add({ ...record, synced: false, createdAt: now, updatedAt: now });
}

export async function listUnsynced(table: 'attendance' | 'payments') {
  return offlineDB[table].where({ synced: false }).sortBy('createdAt');
}

export async function markSynced(table: 'attendance' | 'payments', ids: number[]) {
  const now = Date.now();
  await offlineDB.transaction('rw', offlineDB[table], async () => {
    for (const id of ids) {
      await offlineDB[table].update(id, { synced: true, updatedAt: now });
    }
  });
}


