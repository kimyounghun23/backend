import { auth } from '../../src/firebaseConfig'; // Firebase 설정 파일 가져오기
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase 로그인 함수 가져오기

// PIN 변환 함수: 4자리 PIN을 6자리 이상으로 변환
const transformPIN = (pin) => {
  return `00${pin}`; // PIN 앞에 '00'을 추가하여 6자리로 변환
};
  // Firebase 로그인 로직
  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('모든 필드를 입력하세요!'); // 입력값 검증
      return;
    }

    try {
      const email = `${phoneNumber}@example.com`; // 전화번호를 이메일 형식으로 변환
      const transformedPIN = transformPIN(password); // PIN을 6자리로 변환

      // Firebase Authentication: 로그인
      const userCredential = await signInWithEmailAndPassword(auth, email, transformedPIN);
      Alert.alert('로그인 성공', `환영합니다!`);
      navigation.navigate('Home'); // 로그인 성공 시 홈 화면으로 이동
    } catch (error) {
      console.error('로그인 실패:', error.message); // 오류 출력
      Alert.alert('로그인 실패', error.message);
    }
}
