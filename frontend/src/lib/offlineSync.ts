import { enqueue, listUnsynced, markSynced } from './offlineQueue';
import { API_ENDPOINTS } from './constants';

async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function syncData(baseUrl = '') {
  // Sync attendance
  const unsyncedAttendance = await listUnsynced('attendance');
  if (unsyncedAttendance.length) {
    const ids: number[] = [];
    for (const item of unsyncedAttendance) {
      try {
        console.log('Syncing attendance:', item);
        await postJson(`${baseUrl}${item.endpoint}`, item.payload);
        ids.push(item.id!);
        console.log('Attendance synced:', item);
      } catch (err) {
        console.error('Failed to sync attendance:', item, err);
      }
    }
    if (ids.length) await markSynced('attendance', ids);
  }

  // Sync payments
  const unsyncedPayments = await listUnsynced('payments');
  if (unsyncedPayments.length) {
    const ids: number[] = [];
    for (const item of unsyncedPayments) {
      try {
        console.log('Syncing payment:', item);
        await postJson(`${baseUrl}${item.endpoint}`, item.payload);
        ids.push(item.id!);
        console.log('Payment synced:', item);
      } catch (err) {
        console.error('Failed to sync payment:', item, err);
      }
    }
    if (ids.length) await markSynced('payments', ids);
  }
}

export function initOnlineSync(baseUrl = '') {
  const handler = () => {
    syncData(baseUrl).catch(() => {});
  };
  window.addEventListener('online', handler);
  // run once on init if online
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    handler();
  }
  return () => window.removeEventListener('online', handler);
}

// Helper to queue operations when offline
export async function queueAttendance(payload: any) {
  console.log('Queuing attendance:', payload);
  await enqueue('attendance', {
    clientUuid: payload.clientUuid,
    payload,
    endpoint: '/api/attendance', // تم التعديل هنا
    method: 'POST',
  });
}

export async function queuePayment(payload: any) {
  await enqueue('payments', {
    clientUuid: payload.clientUuid,
    payload,
    endpoint: API_ENDPOINTS.payments.create,
    method: 'POST',
  });
}


