/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 초기화
const firebaseConfig = {
  projectId: import.meta.env.VITE_GOOGLE_CLOUD_PROJECT,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  storageBucket: `${import.meta.env.VITE_GOOGLE_CLOUD_PROJECT}.firebasestorage.app`,
  messagingSenderId: "172381070953",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 개발 환경에서는 Analytics 초기화 건너뛰기
export const analytics = import.meta.env.DEV ? null : getAnalytics(app);

// Firestore 초기화
export const db = getFirestore(app);

// 개발 환경에서 로그 출력
if (import.meta.env.DEV) {
  console.log("Firebase가 실제 프로젝트에 연결되었습니다.");
  console.log("프로젝트 ID:", firebaseConfig.projectId);

  // Firestore 연결 상태 확인
  console.log("Firestore 데이터베이스 연결 상태:", db ? "성공" : "실패");

  // Firebase 설정 로그
  console.log("Firebase 설정:", {
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId,
    authDomain: firebaseConfig.authDomain,
    measurementId: firebaseConfig.measurementId,
  });

  // 현재 사용자 확인
  auth.onAuthStateChanged((user) => {
    console.log("현재 로그인된 사용자:", user ? user.uid : "없음");
  });
}
