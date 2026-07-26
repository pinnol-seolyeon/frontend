import api from '../login/axiosInstance';

export async function fetchCurrentSituation() {
  const response = await api.get('/api/current-situation', {
    withCredentials: true,
    skipAuthRedirect: true,
  });
  return response.data?.data;
}

export async function fetchQuizListByChapter(chapterId) {
  try {
    const response = await api.get('/api/current-situation/quizList', {
      params: { chapterId },
      withCredentials: true,
      skipAuthRedirect: true,
    });
    const body = response.data || {};
    return {
      code: body.code,
      ...body.data, // { quizRecords: [], correctRate }
    };
  } catch (error) {
    if (error?.response?.status === 404) {
      return { code: 'QUIZ_NOTES_NOT_FOUND', quizRecords: [], correctRate: 0 };
    }
    throw error;
  }
}
