import { auth } from '../../src/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// PIN 변환 함수: 4자리 PIN을 6자리 이상으로 변환
const transformPIN = (pin) => {
  return `00${pin}`; // PIN 앞에 '00' 추가
};

// 회원가입 함수
export const signUp = async (phoneNumber, pin) => {
  try {
    const email = `${phoneNumber}@example.com`;
    const transformedPIN = transformPIN(pin); // PIN을 변환
    const userCredential = await createUserWithEmailAndPassword(auth, email, transformedPIN);
    console.log('회원가입 성공:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('회원가입 실패:', error.message);
    throw error;
  }
};

// 로그인 함수
export const logIn = async (phoneNumber, pin) => {
  try {
    const email = `${phoneNumber}@example.com`;
    const transformedPIN = transformPIN(pin); // PIN을 변환
    const userCredential = await signInWithEmailAndPassword(auth, email, transformedPIN);
    console.log('로그인 성공:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('로그인 실패:', error.message);
    throw error;
  }
};

// 로그아웃 함수
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 실패:', error.message);
    throw error;
  }
};
