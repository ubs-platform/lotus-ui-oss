import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class ImageStorageService {
  private dbPromise: Promise<IDBPDatabase>;
  readonly DATA_STORE_IMAGES = 'images';

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB() {
    return openDB('MonaOfflineData', 1, {
      upgrade: (db) => {
        if (!db.objectStoreNames.contains(this.DATA_STORE_IMAGES)) {
          const store = db.createObjectStore(this.DATA_STORE_IMAGES, {
            keyPath: 'url',
          });
          store.createIndex('url', 'url', { unique: true });
        }
      },
    });
  }

  /**
   * Returns true if all is done, othervise some or nothing returns false
   * @param urls_
   */
  async saveImage(urls_: string[]): Promise<boolean> {
    let success = true;

    const urls = [...new Set(urls_)];
    const cache = await caches.open('content-materials');
    //

    // const prom = urls.map((a) => fetch(a));
    // const drops =
    const db = await this.dbPromise;
    // const tr = await db.transaction(this.DATA_STORE_IMAGES, 'readwrite');
    // const store = await tr.objectStore(this.DATA_STORE_IMAGES);
    for (let index = 0; index < urls.length; index++) {
      try {
        const url = urls[index];
        await cache.add(url);
        const drop = await fetch(url);
        if (drop.ok) {
          await db.put(this.DATA_STORE_IMAGES, {
            url: drop.url,
            blob: await drop.blob(),
          });
        }
      } catch (ex) {
        console.warn(ex);
        success = false;
      }
    }

    return success;
    // await tr.commit();

    // URL'den resmi çek

    // IndexedDB'ye kaydet
  }

  async saveItemDirect(url: string, blob: Blob): Promise<void> {
    const db = await this.dbPromise;
    // const tr = await db.transaction(this.DATA_STORE_IMAGES, 'readwrite');
    // const store = await tr.objectStore(this.DATA_STORE_IMAGES);
    await db.put(this.DATA_STORE_IMAGES, {
      url: url,
      blob: blob,
    });
    // await tr.commit();

    // URL'den resmi çek

    // IndexedDB'ye kaydet
  }

  async getImage(url: string): Promise<Blob | null> {
    const db = await this.dbPromise;

    // IndexedDB'den resmi al
    const record = await db.get(this.DATA_STORE_IMAGES, url);
    return record ? record.blob : null;
  }

  async deleteImage(url: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(this.DATA_STORE_IMAGES, url);
  }
}
