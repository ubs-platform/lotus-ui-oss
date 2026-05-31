console.info('SERVICE WORKER: Selamın Aleyküm');
// ANGULAR SENİN YAPACAĞIN SERVİS WORKERE SOKAMimportScripts('ngsw-worker.js');
function resulting(res, fail, resultingText) {
  return (a) => {
    console.info(resultingText);
    return a ? res(a) : fail(a);
  };
}
let dbInstance;

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance)
    } else {
      const request = indexedDB.open('MonaOfflineData', 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'url' });
        }
      };
      request.onsuccess = (event) => {
        dbInstance = event.target.result;
        resolve(event.target.result)
        
      };
      request.onerror = (event) => reject(event.target.error);
    }

  });
}

function getDataFromIndexedDB(key) {
  return openDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('images', 'readonly');
      const store = transaction.objectStore('images');
      const request = store.get(key);
      request.onsuccess = () => {
        const res = request.result;
        if (res) {
          resolve(new Response(res.blob, {}));
        } else {
          resolve(null)
        }
      };
      request.onerror = () => reject(request.error);
    });
  });
}

function tryToFetch(funcs) {
    return funcs[0]().then(a => {
      if (a) {
        return a;
      } else if (funcs.length > 1) {
        return tryToFetch(funcs.slice(1))
      } else {
        return null;
      }
    })
 
};

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Örnek: Sadece belirli bir yol için IndexedDB'den veri al
  if (url.startsWith(location.protocol + '//' + location.host + '/api/file/')) {
    console.info('Yarış modu');
    const urlPure = event.request.url.replace(/\?width\=.*/g, '');

    return event.respondWith(
      new Promise((ok, fail) => {
        tryToFetch(
           [() => caches.match(event.request),
            () => getDataFromIndexedDB(urlPure),
            () => fetch(event.request)]
        ).then(val => {
          if (val) {
            ok(val);
          } else {
            fail(404);
          }
        });

      })
    );
  }
});

importScripts('ngsw-worker.js');
