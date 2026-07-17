// Convert Mongo lean documents into plain JSON-safe objects for transport
// over server functions (ObjectId -> string, Date -> ISO string).
export function serialize<T = any>(input: any): T {
  return JSON.parse(JSON.stringify(input, (_key, value) => value)) as T;
}

// Normalize a single document: expose `id` (string) alongside stripped `_id`.
export function toDTO(doc: any): any {
  if (!doc) return doc;
  const plain = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const { _id, __v, ...rest } = plain;
  const out: any = { id: _id?.toString?.() ?? _id, ...rest };
  for (const k of Object.keys(out)) {
    const v = out[k];
    if (v && typeof v === "object" && v._bsontype === "ObjectID") out[k] = v.toString();
    else if (v instanceof Date) out[k] = v.toISOString();
  }
  return serialize(out);
}

export function toDTOList(docs: any[]): any[] {
  return (docs ?? []).map(toDTO);
}
