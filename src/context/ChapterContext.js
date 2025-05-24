import { createContext, useContext, useState, useEffect } from "react";

const ChapterContext = createContext();
export const useChapter = () => useContext(ChapterContext);

export const ChapterProvider = ({ children }) => {
  const [chapterData, setChapterDataState] = useState(null);

  // ✅ localStorage에도 저장
  const setChapterData = (data) => {
    setChapterDataState(data);
    localStorage.setItem("chapterData", JSON.stringify(data));
  };

  // ✅ 앱 시작 시 localStorage에서 복원
  useEffect(() => {
    const stored = localStorage.getItem("chapterData");
    if (stored) {
      setChapterDataState(JSON.parse(stored));
    }
  }, []);


  //로그아웃&학습완료 시
  const clearChapterData = () => {
    localStorage.removeItem("chapterData");
    setChapterDataState(null);
    console.log("🧹chapterData 초기화 완료");
  };

  return (
    <ChapterContext.Provider value={{ chapterData, setChapterData,clearChapterData }}>
      {children}
    </ChapterContext.Provider>
  );
};
