/**
 * Service Worker for Mobile Performance Optimization
 */

const CACHE_NAME = 'periodhub-v1.0.0';
const STATIC_CACHE = 'periodhub-static-v1.0.0';
const DYNAMIC_CACHE = 'periodhub-dynamic-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/zh',
  '/en',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icon.svg',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png'
];

// 需要缓存的API路径
const API_CACHE_PATTERNS = [
  /\/api\/articles/,
  /\/api\/tools/,
  /\/api\/health-guide/
];

// 图片和媒体文件缓存策略
const MEDIA_CACHE_PATTERNS = [
  /\.(jpg|jpeg|png|gif|webp|avif)$/,
  /\.(svg|ico)$/,
  /\/images\//,
  /\/downloads\//
];

// 安装事件
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // 删除旧版本的缓存
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName.startsWith('periodhub-')) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }
  
  // 跳过非GET请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 处理不同类型的请求
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
  } else if (isMediaAsset(request.url)) {
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request.url)) {
    event.respondWith(networkFirst(request));
  } else if (isPageRequest(request.url)) {
    event.respondWith(networkFirstWithOfflineFallback(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// 缓存优先策略（用于静态资源）
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // 缓存成功的响应
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Network error', { status: 503 });
  }
}

// 网络优先策略（用于动态内容）
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // 缓存成功的响应
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    console.error('Network first strategy failed:', error);
    return new Response('Network error', { status: 503 });
  }
}

// 网络优先策略，带离线回退（用于页面请求）
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    // 缓存成功的响应
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果都没有，返回离线页面
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    console.error('Network first with offline fallback failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// 检查是否为静态资源
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.endsWith(asset)) ||
         url.includes('/_next/static/') ||
         url.includes('/favicon') ||
         url.includes('/icon');
}

// 检查是否为媒体资源
function isMediaAsset(url) {
  return MEDIA_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

// 检查是否为API请求
function isAPIRequest(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url)) ||
         url.includes('/api/');
}

// 检查是否为页面请求
function isPageRequest(url) {
  return !url.includes('.') || 
         url.endsWith('.html') ||
         url.includes('/zh/') ||
         url.includes('/en/');
}

// 消息处理
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage({ type: 'CACHE_STATUS', payload: status });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

// 获取缓存状态
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = keys.length;
  }
  
  return status;
}

// 清理所有缓存
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  
  await Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName.startsWith('periodhub-')) {
        return caches.delete(cacheName);
      }
    })
  );
  
  console.log('All caches cleared');
}

// 定期清理过期缓存
setInterval(async () => {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();
    
    // 清理超过24小时的缓存
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (responseDate < oneDayAgo) {
            await cache.delete(key);
            console.log('Cleared expired cache:', key.url);
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to clean expired cache:', error);
  }
}, 60 * 60 * 1000); // 每小时运行一次
