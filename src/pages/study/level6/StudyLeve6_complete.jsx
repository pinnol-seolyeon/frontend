import styled from "styled-components";
import Sidebar from "../../../components/Sidebar";

import { useNavigate } from "react-router-dom";
import React from "react";
import { useChapter } from "../../../context/ChapterContext";
import background from "../../../assets/study_background.png";
import hoppin from "../../../assets/hoppin_hapyface.svg";

/*학습하기-6단계-완료*/

const Wrapper=styled.div`
    width:100%;
    min-height:100vh;
    height:auto;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    position: relative;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin-left: 0;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ImageWrapper=styled.div`
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
`;

const Image=styled.img`
    width:80%; 
    height:auto;
    object-fit:contain;
    width: clamp(200px,50vw,350px);
    align-self:center;
`;

const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height: fit-content;
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    position:relative;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1;
  width: 100%;
  margin: 0 auto;
`;


const ImageWithSpeechWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  width: 100%;
  margin: 1rem 0rem;
`;

const NextButton = styled.button`
  display:flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.8rem 3rem;
  background-color: #478CEE;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  font-size: 18px;
  font-weight: 500;
  margin-top: 1rem;

  transition: background-color 0.3s;
  &:hover {
    background-color: #104EA7;
  }

  &:active {
    outline: none;
  }
`;


function StudyLevel6_Complete({ user, login, setLogin }){

    const navigate=useNavigate();
    const {chapterData,clearChapterData}=useChapter();

    const handleAnalysisPage=()=>{
        // 학습분석 페이지로 이동
        navigate('/dashboard');
    };
    
    return(
    <>
        <Wrapper>
            <ContentWrapper>
                <Sidebar user={user} login={login} setLogin={setLogin} defaultCollapsed={true} />
                <MainWrapper>
                    <ImageWithSpeechWrapper>
                        <ImageWrapper>
                            <Image src={hoppin} alt="호핀" />
                        </ImageWrapper>
                        
                        <SpeechBubble>
                            <TextBox>
                                <div style={{ 
                                    fontSize: '28px', 
                                    fontWeight: 'bold', 
                                    marginBottom: '1rem', 
                                    color: '#333',
                                    textAlign: 'center'
                                }}>
                                    학습완료
                                </div>
                                <div style={{ 
                                    fontSize: '18px', 
                                    fontWeight: "400", 
                                    color: "#333",
                                    lineHeight: '1.3',
                                    textAlign: 'center',
                                    wordBreak: 'keep-all',
                                    whiteSpace: 'pre-line'
                                }}>
                                    {`학습분석 페이지에서 나의 학습 점수와 \n 성과를 분석해보고 복습해보자!`}
                                </div>
                            </TextBox>

                            <NextButton onClick={handleAnalysisPage}>
                                학습분석 페이지 가기
                            </NextButton>
                        </SpeechBubble>
                    </ImageWithSpeechWrapper>
                </MainWrapper>
            </ContentWrapper>
        </Wrapper>
    </>
    );
}


export default StudyLevel6_Complete;