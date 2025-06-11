export async function fetchQuizByChapterId(chapterId) {
  const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/quiz?chapterId=${chapterId}`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error("퀴즈 불러오기 실패");

  return await res.json();
}