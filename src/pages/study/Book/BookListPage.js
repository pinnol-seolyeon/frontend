import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import '../Book/BookPage.css';

function BookListPage() {
  const navigate = useNavigate();

  const bookList = [
    { title: "초등학교 3,4학년 생활금융익힘책", icon: "📘", path:"/book/chapter"}, //해당 책의 id를 나중에 저장해놔야함
    
  ];

  const handleBookSelect = (path) => {
    navigate(path);
  };


  //유저가 해당 책의 진도를 완료 -> review-card completed로.. 기본은 review-card
  return (
    <div className="book-page">
      <div className="page-header">
        <h1>학습할 책을 선택하세요.</h1>
      </div>

      <div className="book-modules">
        {bookList.map((book,index) => (
          <div
            key={index}
            className="book-card completed">
 
            <div className="module-icon">{book.icon}</div><br/>
            <h3 className="book-title">{book.title}</h3>
          
            <div className="review-buttons">
              <button
                className="review-btn"
                onClick={() => handleBookSelect(book.path)}
              >
                학습 시작!
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookListPage;
