import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate,useSearchParams} from 'react-router-dom';
import axios from 'axios';
import '../Chapter/ChapterPage.css';
import {fetchChapters} from "../../../api/study/level3API";

function ChapterPage() {
  const navigate = useNavigate();
  const [searchParams]=useSearchParams(); //URL에서 bookID 가져오기
  const bookId=searchParams.get("bookId");

  const [chapters,setChapters]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

    const handleFetchChapters=async()=>{
      try{
        const data=await fetchChapters("682829208c776a1ffa92fd4d");
          setChapters(data);
        }
        catch(err){
          setError(err.message);
      }finally{
        setLoading(false);
      }
    };


  //페이지 진입 시 자동 실행
  useEffect(()=>{
    handleFetchChapters();
  },[]);


  const handleChapterClick = (path) => {
    navigate(path);
  };

  if (loading) return <div className="loading">단원을 불러오는중..</div>;
  if (error) return <div className="error-message">{error}</div>;

  //유저가 해당 책의 진도를 완료 -> review-card completed로.. 기본은 review-card
  
  return (
    <div className="chapter-page">
      <div className="page-header">
        {/* <h2>단원을 선택하세요</h2> */}
      </div>

      <div className="book-modules">
        {chapters.map((chapter,index) => (
          <div key={index} className="book-card completed">
            <div className="module-icon">📖</div>
            <h3>{chapter.title}</h3>
            <div className="review-buttons">
              <button
                className="review-btn"
                onClick={() => handleChapterClick('/study/1')}
              >
                학습하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterPage;