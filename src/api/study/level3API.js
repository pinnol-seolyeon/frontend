export async function fetchChapterContents(chapterId){
    const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/start?chapterId=${chapterId}`,{
        method:"GET",
        credentials:"include"
    });

    if(!response.ok){
        throw new Error("단원 내용을 불러오는 데 실패했습니다.");
    }

    const data=await response.json();
    return data;
}

export async function fetchChapters(bookId){
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
    const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/feedback`,{
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