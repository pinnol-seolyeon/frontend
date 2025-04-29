import React, { useState, useEffect } from 'react';
// import { auth, db } from '../firebase/config';
// import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Outlet } from 'react-router-dom';
import '../../pages/main/MainLayout.css';


function MainLayout() {
  // const [user, setUser] = useState(null);
  // const [userProgress, setUserProgress] = useState({
  //   points: 0,
  //   progressRate: 0,
  //   lastCompleted: null,
  //   currentStep: 1,
  //   totalSteps: 6,
  //   completedSteps: []
  // });
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const loadUserData = async () => {
  //     if (!auth.currentUser) return;

  //     try {
  //       const userDocRef = doc(db, 'users', auth.currentUser.uid);
  //       const docSnap = await getDoc(userDocRef);

  //       if (docSnap.exists()) {
  //         const data = docSnap.data();
  //         setUserProgress(prev => ({
  //           ...prev,
  //           points: data.points || 0,
  //           progressRate: data.progressRate || 0,
  //           lastCompleted: data.lastCompleted || null,
  //           currentStep: data.currentStep || 1,
  //           totalSteps: 6,
  //           completedSteps: Array.isArray(data.completedSteps)
  //             ? data.completedSteps
  //             : Object.keys(data.completedSteps || {}).map(Number)
  //         }));
  //       } else {
  //         console.log('사용자 데이터가 존재하지 않습니다. 기본값을 사용합니다.');
  //       }
  //     } catch (error) {
  //       console.error('사용자 데이터 로드 실패:', error);
  //       if (error.code === 'permission-denied') {
  //         console.log('Firestore 접근 권한이 없습니다. 관리자에게 문의하세요.');
  //       }
  //     }
  //   };

  //   const unsubscribe = auth.onAuthStateChanged((currentUser) => {
  //     if (currentUser) {
  //       setUser(currentUser);
  //       loadUserData();
  //     } else {
  //       setUser(null);
  //       setUserProgress({
  //         points: 0,
  //         progressRate: 0,
  //         lastCompleted: null,
  //         currentStep: 1,
  //         totalSteps: 6,
  //         completedSteps: []
  //       });
  //       navigate('/');
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [navigate]);

  // const handleLogout = async () => {
  //   try {
  //     await auth.signOut();
  //     navigate('/');
  //   } catch (error) {
  //     console.error('로그아웃 실패:', error);
  //   }
  // };

  return (
    <div className="main-layout">
  
      <main className="main-content">
        <div className="content-area">
          {/* <Outlet context={{ userProgress, setUserProgress }} />
          {window.location.pathname === '/main' && userProgress.completedSteps.length === 0 && (
            <div className="no-data-message">
              아직 분석할 학습 데이터가 없습니다. 학습을 시작해보세요!
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;