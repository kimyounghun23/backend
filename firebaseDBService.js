//firebase에서 흡연구역 위치 DB 가져오는 로직 
const db = require('./firebaseConfig');

/**
 * Firestore에서 흡연구역 정보 가져오기
 * @returns {Promise<Array>} 흡연구역 데이터 배열
 */
async function getSmokingZones() {
  try {
    const snapshot = await db.collection('smoking_zones').get();
    const zones = [];

    snapshot.forEach(doc => {
      zones.push(doc.data());
    });

    return zones;
  } catch (error) {
    console.error('Firestore 데이터 가져오기 실패:', error);
    throw new Error('흡연구역 정보를 가져오는 중 문제가 발생했습니다.');
  }
}

module.exports = { getSmokingZones };
