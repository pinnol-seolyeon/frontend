import { Cookies } from "react-cookie";

const cookies=new Cookies();


//쿠키 생성:setCookie(쿠키 이름,쿠키에 넣을 값,옵션)
export const setCookie=(name,value,options)=>{
    return cookies.set(name,value,{...options})
}

//쿠키 조회:getCookie(쿠키 이름)
export const getCookie=(name)=>{
    return cookies.get(name)
}

//쿠키 삭제
export const removeCookie=(name)=>{
    return cookies.remove(name,{path:'/'})
}
