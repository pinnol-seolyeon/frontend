export async function fetchChapterTitle(chapterId){
    const response=await fetch(`https://finnol.site/api/study/chapter?chapterId=${chapterId}`,{
        method:"GET",
        credentials:"include"
    });

    if(!response.ok){
        throw new Error("단원명을 불러오는데 실패하였습니다.")
    }

    const data=await response.text();
    return data;
}