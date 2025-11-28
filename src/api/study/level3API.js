export async function fetchChapterContents(level, chapterId, bookId){
    const url = bookId 
        ? `${process.env.REACT_APP_API_BASE_URL}/api/session?level=${level}&chapterId=${chapterId}&bookId=${bookId}`
        : `${process.env.REACT_APP_API_BASE_URL}/api/session?level=${level}&chapterId=${chapterId}`;
    
    const response=await fetch(url,{
        method:"GET",
        credentials:"include",
    });

    // 401 에러 처리 (알림 제거)
    if (response.status === 401 || response.status === 403) {
        console.log('🔒 인증 오류 발생:', url, response.status);
        console.log('🔍 응답:', await response.text());
        throw new Error("인증이 필요합니다.");
    }

    if(!response.ok){
        throw new Error("단원 내용을 불러오는 데 실패했습니다.");
    }

    const result=await response.json();
    return result.data; // 응답의 data 필드 반환
}

export async function fetchChapters(bookId){
    // TODO: 실제 단원 리스트 API 엔드포인트로 변경 필요
    const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/chapter-select?bookId=${bookId}`,{
        method:"GET",
        credentials:"include"
    });

    if(!response.ok){
        throw new Error("단원 리스트를 불러오는데 실패하였습니다.")
    }

    const data=await response.json();
    console.log("🐛🐛",data)
    return data;
}


// 수업 중 AI와 상호작용(피드백)
export async function fetchFeedback(){
    const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/ai/content-chat`,{
        method:"POST",
        credentials:"include"
    });

    if(!response.ok){
        throw new Error("❌피드백을 불러오는 데 실패했어요")
    }

    const data=await response.json();
    console.log("🐛🐛",data)
    return data;
}