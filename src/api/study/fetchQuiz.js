export async function fetchQuizByChapterId(chapterId) {
  const res = await fetch(`http://3.34.150.31:8080/api/quiz?chapterId=${chapterId}`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error("퀴즈 불러오기 실패");

  return await res.json();
}