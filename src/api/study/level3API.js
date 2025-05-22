export async function fetchChapterContents(bookId){
    const response=await fetch(`http://localhost:8080/api/study/start?bookId=${bookId}`,{
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
    const response=await fetch(`http://localhost:8080/api/study?bookId=${bookId}`,{
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