import React, { createContext, useContext, useState } from "react";

// Context 생성
const ChapterContext = createContext();

// 커스텀 Hook: 다른 컴포넌트에서 쉽게 접근 가능
export const useChapter = () => useContext(ChapterContext);

// Provider: 전체 앱 또는 필요한 범위 감싸기
export const ChapterProvider = ({ children }) => {
  const [chapterData, setChapterData] = useState(null);

  return (
    <ChapterContext.Provider value={{ chapterData, setChapterData }}>
      {children}
    </ChapterContext.Provider>
  );
};
