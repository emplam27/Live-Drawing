// 캐시 이름
const CACHE_NAME = "cache-v1";

// 캐싱할 파일
const FILES_TO_CACHE = [
    "/offline.html",
    "/favicon.ico"
];

// 상술한 파일 캐싱
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );
});

// CACHE_NAME이 변경되면 오래된 캐시 삭제
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (CACHE_NAME !== key) return caches.delete(key);
                })
            )
        )
    );
});

// 요청에 실패하면 오프라인 페이지 표시
self.addEventListener("fetch", (event) => {
    if ("navigate" !== event.request.mode) return;

    event.respondWith(
        fetch(event.request).catch(() =>
            caches
                .open(CACHE_NAME)
                .then((cache) => cache.match("/offline.html"))
        )
    );
});