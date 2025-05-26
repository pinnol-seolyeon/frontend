export async function fetchChapterTitle(chapterId){
    const response=await fetch(`http://localhost:8080/api/study/chapter?chapterId=${chapterId}`,{
        method:"GET",
        credentials:"include"
    });

    if(!response.ok){
        throw new Error("단원명을 불러오는데 실패하였습니다.")
    }

    const data=await response.text();
    return data;
}