export async function fetchChapterTitle(chapterId){
    const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/chapter?chapterId=${chapterId}`,{
        method:"GET",
        credentials:"include"
    });

    if(!response.ok){
        throw new Error("단원명을 불러오는데 실패하였습니다.")
    }

    const data=await response.text();
    return data;
}