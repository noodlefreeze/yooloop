export interface Shadowing {
  title: string
  startMs: number
  vid: string
  audio: Blob
  id: number
  createdAt: number
  updatedAt: number
}

export type UserShadowing = 'title' | 'startMs' | 'vid' | 'audio'

let db: IDBDatabase | null = null
const DB_NAME = 'yooloop'
export const STORE_NAME = 'shadowing'
const VERSION = 1

export async function openDb(): Promise<IDBDatabase> {
  if (db) return db

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }

    request.onsuccess = () => {
      db = request.result

      db.onclose = () => {
        db = null
      }
      db.onversionchange = () => {
        db?.close()
        db = null
      }

      resolve(db)
    }

    request.onerror = () => reject(request.error)
  })
}

async function getStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  const database = await openDb()
  return database.transaction(STORE_NAME, mode).objectStore(STORE_NAME)
}

export async function addShadowing(data: Pick<Shadowing, UserShadowing>) {
  const store = await getStore('readwrite')
  const now = Date.now()
  return new Promise((resolve, reject) => {
    const req = store.add({ ...data, createdAt: now, updatedAt: now })
    req.onsuccess = () => {
      resolve({ success: true, id: req.result as number })
    }
    req.onerror = () =>
      reject({
        success: false,
        error: req.error,
      })
  })
}

export async function deleteShadowing(id: number) {
  const store = await getStore('readwrite')
  return new Promise((resolve, reject) => {
    const req = store.delete(id)
    req.onsuccess = () => resolve({ success: true })
    req.onerror = () => reject({ success: false, error: req.error })
  })
}

export async function getAllShadowing() {
  const store = await getStore('readonly')
  return new Promise((resolve, reject) => {
    const req = store.getAll()
    req.onsuccess = () =>
      resolve({
        success: true,
        shadowing: req.result as Shadowing[],
      })
    req.onerror = () =>
      reject({
        success: true,
        error: req.error,
      })
  })
}
