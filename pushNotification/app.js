// 실사용 앱 푸시알림 기능 로직
// 사용자와 서버 간 요청/응답 관리,서비스 로직 호출
const http = require('http');
const url = require('url');
const https = require('https');  // 외부 API 호출
const { sendPushNotification } = require('../../src/firebasePushService');
const { getSmokingZones } = require('../../src/firebaseDBService');

// 거리 계산 함수
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 거리 (미터)
}

// Kakao API 호출 함수
function callKakaoApi(originLat, originLon, destLat, destLon, callback) {
  const kakaoApiKey = 'YOUR_KAKAO_API_KEY';
  const options = {
    hostname: 'apis-navi.kakao.com',
    path: `/v1/route?origin=${originLon},${originLat}&destination=${destLon},${destLat}`,
    method: 'GET',
    headers: {
      Authorization: `KakaoAK ${kakaoApiKey}`,
    },
  };

  const req = https.request(options, res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      callback(null, JSON.parse(data));
    });
  });

  req.on('error', error => {
    callback(error);
  });

  req.end();
}

// HTTP 서버 생성
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  if (path === '/check-location' && method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const { latitude, longitude, token } = JSON.parse(body); // 사용자 위치와 FCM 토큰
        const smokingZones = await getSmokingZones(); // Firestore에서 데이터 가져오기

        // 가장 가까운 흡연구역 찾기
        let closestZone = null;
        let minDistance = Infinity;

        smokingZones.forEach(zone => {
          const distance = calculateDistance(latitude, longitude, zone.latitude, zone.longitude);
          if (distance < minDistance) {
            minDistance = distance;
            closestZone = zone;
          }
        });

        if (!closestZone) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: '흡연구역을 찾을 수 없습니다.' }));
          return;
        }

        // Kakao API를 사용하여 최적 경로 계산
        callKakaoApi(
          latitude,
          longitude,
          closestZone.latitude,
          closestZone.longitude,
          async (error, apiResponse) => {
            if (error) {
              console.error('경로 계산 실패:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, message: '경로 계산 실패' }));
              return;
            }

            // 푸시 알림 전송
            await sendPushNotification(
              token,
              '최적 경로 알림',
              `가장 가까운 흡연구역은 ${closestZone.name}입니다. 최적 경로를 확인하세요.`
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                success: true,
                route: apiResponse,
                closestZone,
              })
            );
          }
        );
      } catch (error) {
        console.error('알림 전송 실패:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: '서버 오류' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('페이지를 찾을 수 없습니다.');
  }
});

// 서버 실행
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
