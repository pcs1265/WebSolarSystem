const sCacheName ="WebSolarSystem";//캐시 이름 선언
const aFilesToCache = [];//캐시할 파일 선언

//서비스워커 설치하고 캐시파일 저장
self.addEventListener('install', pEvent => {
    console.log('서비스워커를 설치합니다.');
    pEvent.waitUntil(
        caches.open(sCacheName)
        .then(pCache => {
          //return pCache.addAll(aFilesToCache); //캐시 저장
          return pCache.delete(aFilesToCache);    //하지만 지금은 저장 안함
        })
      );
});

// 고유번호 할당받은 서비스 워커 동작 시작
self.addEventListener('activate', pEvent => {
});


//데이터 요청시 네트워크 또는 캐시에서 찾아 반환 
self.addEventListener('fetch', pEvent => {
    pEvent.respondWith(
      caches.match(pEvent.request)
      .then(response => {
        if (!response) {
          return fetch(pEvent.request);
        }
        return response;
      }).catch(err => console.log(err))
    );
  });