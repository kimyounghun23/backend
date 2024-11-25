import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 프로젝트 설정 정보
const firebaseConfig = {
    apiKey: "AIzaSyCMCohGKZGj2sSguULCZEzNkEteG-gUQns",
  authDomain: "smokingareamap-c8661.firebaseapp.com",
  databaseURL: "https://smokingareamap-c8661-default-rtdb.firebaseio.com",
  projectId: "smokingareamap-c8661",
  storageBucket: "smokingareamap-c8661.firebasestorage.app",
  messagingSenderId: "186520400816",
  appId: "1:186520400816:web:33082e83aa0e364b605c75",
  measurementId: "G-QCMSPRN0CQ"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 가져오기
const auth = getAuth(app); // 인증 서비스
const db = getFirestore(app); // Firestore 데이터베이스

export { auth, db };
