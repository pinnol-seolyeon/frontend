export async function fetchChapterTitle(chapterId){
    const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/session/start-level?level=1&chapterId=${chapterId}`,{
        method:"POST",
        credentials:"include",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if(!response.ok){
        throw new Error("단원명을 불러오는데 실패하였습니다.")
    }

    const result=await response.json();
    return result.data; // 응답의 data 필드 반환
}