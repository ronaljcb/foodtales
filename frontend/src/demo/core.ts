// A deliberately local showcase API. No real credentials or production data.
type Row = Record<string, any>;
export function store(key: string, seed: Row[]): Row[] {
  if (typeof window === 'undefined') return structuredClone(seed);
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch { /* reset corrupt demo data */ }
  save(key, seed); return structuredClone(seed);
}
export function save(key: string, rows: Row[]) { localStorage.setItem(key, JSON.stringify(rows)); }
export function reply(data: unknown, status = 200) { return Response.json(data, { status }); }
export async function payload(body: any): Promise<Row> {
  if (body instanceof FormData) {
    const result: Row = {};
    for (const [k, v] of body.entries()) {
      if (v instanceof Blob && (v.type === 'application/json' || ['post','restaurant','food','user'].includes(k))) Object.assign(result, JSON.parse(await v.text()));
      else if (v instanceof File && v.size) {
        if (v.size > 1000000) throw new Error('Usa una imagen menor a 1 MB en esta demo.');
        result[k === 'profilePicture' ? k : 'image'] = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(v); });
      } else result[k] = v;
    }
    return result;
  }
  return typeof body === 'string' ? JSON.parse(body || '{}') : body || {};
}
export function mutate(key: string, rows: Row[], method: string, id: string | undefined, body: Row, idKey = 'id') {
  const index = rows.findIndex(row => String(row[idKey]) === id);
  if (method === 'DELETE') { if (index < 0) return reply({message:'No encontrado'},404); rows.splice(index,1); save(key,rows); return reply({ok:true}); }
  if (method === 'PUT' || method === 'PATCH') { if (index < 0) return reply({message:'No encontrado'},404); rows[index] = {...rows[index],...body,[idKey]:rows[index][idKey]}; save(key,rows); return reply(rows[index]); }
  const row = {...body,[idKey]:Date.now()}; rows.unshift(row); save(key,rows); return reply(row,201);
}
