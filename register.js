import { auth, db } from '../../src/firebaseConfig'; // Firebase 설정 가져오기
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

// PIN 변환 함수: 4자리 PIN을 6자리 이상으로 변환
const transformPIN = (pin) => {
    return `00${pin}`; // PIN 앞에 '00'을 추가하여 6자리로 변환
};


    // Firebase 회원가입 로직
    const handleRegister = async () => {
        if (!membername || !password || !name) {
            Alert.alert('모든 필드를 입력하세요!');
            return;
        }

        try {
            const email = `${membername}@example.com`; // 전화번호를 이메일 형식으로 변환
            const transformedPIN = transformPIN(password); // PIN을 6자리로 변환

            // Firebase Authentication: 회원가입
            const userCredential = await createUserWithEmailAndPassword(auth, email, transformedPIN);
            const uid = userCredential.user.uid;

            // Firestore에 사용자 정보 저장
            await addDoc(collection(db, 'users'), {
                uid: uid,
                username: name,
                phoneNumber: membername,
                createdAt: new Date(),
            });

            Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
            navigation.navigate('Login'); // 로그인 화면으로 이동
        } catch (error) {
            console.error('회원가입 실패:', error.message);
            Alert.alert('회원가입 실패', error.message);
        }
    }
