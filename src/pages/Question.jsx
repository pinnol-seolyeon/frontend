import React,{useState,useEffect,useRef} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';

import styled,{keyframes} from "styled-components";
import axios from 'axios';

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import mic from "../assets/mic_img.svg";
import background from "../assets/background_question.png";
import hopin from "../assets/hopin_face.png";

/*질문 버튼 눌렀을 때*/


const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 0;
  padding: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const MainWrapper = styled.div` 
  flex: 1;
  min-height: calc(100vh - var(--header-height, 70px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BackButtonWrapper = styled.div`
    width: 100%;
    max-width: 1000px;
    display: flex;
    justify-content: flex-start;
    align-self: center;
`;

const BackButton = styled.div`
    border-radius: 8px;
    padding: 0.6rem 1rem;
    border: 1px solid #B8B8B8;
    font-size: 0.8rem;
    font-weight: 300;
    color: #4C4C4C;
    cursor: pointer;
    background-color: white;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f8f9fa;
        border-color: #4A91FE;
        color: #4A91FE;
    }
`;

const QuestionArea = styled.div`
    width: 100%;
    max-width: 1000px;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-self: center;
    overflow: hidden;
    position: relative;
    margin-top: 1rem;
`;

const ChatContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.3rem;
    overflow-y: auto;
    margin-top: 1rem;
    background-color: #F0F4FC;
`;

const InputArea = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 1rem 0;
`;

const TextInput = styled.input`
    flex: 1;
    background: #ffffff;
    padding: 0.8rem 1rem;
    border-radius: 10px;
    font-size: 15px;
    outline: none;
    border: 1px solid #DADADA;
    
    &::placeholder {
        color: #9E9E9E;
    }

    &::focus {
        outline: none;
    }
`;

const MicButton = styled.button`
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: #ffffff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #478CEE;
    transition: all 0.3s ease;
    
    &:hover {
        border: 1px solid #3367D6;
    }

    &:active {
        outline: none;
    }
`;

const SendButton = styled.button`
    padding: 0.8rem 1.2rem;
    background: #4A91FE;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
        background: #3367D6;
    }
`;

const QuestionWrapper=styled.div`
    flex-grow:1;
    overflow-y:auto;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    width:100%;
    height:100%;
    // padding-bottom:12vh;
`

const fadeIn=keyframes`
    from{
        opacity:0;
        transform:translateY(20px);
    }
    to{
        opacity:1;
        transofrm:translateY(0);
    }
`;

const MessageList=styled.div`
    width:100%;
    flex-grow:1;
    overflow-y:auto;
    display:flex;
    flex-direction:column;
    padding: 10px;
    gap: 0.2rem;
`;


const TigerImg=styled.img`
    width: 90%; 
    height: 90%;
    object-fit: contain;
    object-position: bottom;
`;

const ProfileArea = styled.div`
    display:flex;
    align-items:flex-end;
    justify-content:center;
    border-radius: 50%;
    width: 3.5rem;
    height: 3.5rem;
    background: linear-gradient(to bottom, #EFF6FF, #AED2FF);
    overflow: hidden;
    flex-shrink: 0;
`;

const ReceiveMessage = styled.div`
    background-color: #ffffff;
    border-radius: 20px;
    padding: 0.5rem 1.5rem;
    
    font-size: 14px;
    line-height: 1.4;
    font-weight: 400;
    color: #333333;

    
    max-width: 70%;
    min-width: fit-content;
    word-wrap: break-word;
    white-space: pre-wrap;
    
    animation: ${fadeIn} 0.3s ease-out;
`;

const Message = styled.div`
    background-color: #79B0FF;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    
    font-size: 14px;
    line-height: 1.4;
    color: #ffffff;
    font-weight: 400;

    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    max-width: 70%;
    min-width: fit-content;

    word-wrap: break-word;
    white-space: pre-wrap;
    align-self: flex-end;

    animation: ${fadeIn} 0.3s ease-out;
`;
const MicIcon=styled.img`
    width:70%;
`;

const TranscriptBox = styled.div`
    width: 80%;
    height: 80px;
    //   padding: 10px;
    font-size: 16px;
    border-radius: 30px;
    margin:15px;

    border: 1px solid #ccc;
    background-color: #FEF3E1;
`;

const TranscriptWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom:20px;
`;

const StopButton = styled.button`
    background-color: red;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin:15px;

    &:hover {
        background-color: darkred;
    }
`;

const CloseButton=styled.button`

    background-color:transparent;
    color:white;
    font-size:20px;

    border:none;

    &:hover {
    color:black;
    }

`;

function Question({ user, login, setLogin }){
    
    const[messages,setMessages]=useState([]);
    const messageEndRef=useRef(null);
    const[loading,setLoading]=useState(false);
    const[isListening,setIsListening]=useState(false);
    const[transcript,setTranscript]=useState(''); //음성 인식 결과
    const recognitionRef=useRef(null); //recognition 매번 호출 비효율 문제 해결
    const navigate=useNavigate();
    const location=useLocation(); //이전 페이지 정보를 받기 위해
    const [returnToIndex,setReturnToIndex]=useState(0);
    const [previousPage,setPreviousPage]=useState('/main'); // 기본값은 메인 페이지


    //컴포넌트가 처음 마운트될 때 한 번만 실행됨 
    //mount 시에 location.state에서 returnToIndex 꺼내서 따로 저장장
    useEffect(()=>{
        //Web Speech API 설정
        const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
        const recognition=new SpeechRecognition();
        recognition.lang='ko-KR';
        recognition.continuous=true;
        recognition.interimResults=true;

        if(location.state?.returnToIndex!==undefined){
            setReturnToIndex(location.state.returnToIndex);
        }
        
        // 이전 페이지 정보 저장
        if(location.state?.from){
            setPreviousPage(location.state.from);
        }

        //사용자가 말하는 내용을 실시간으로 transcript에 저장 
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
            
            // 음성인식 결과가 있으면 실제 텍스트로 교체
            if(transcript.trim()) {
                setTranscript(transcript);
            }
        };
        recognitionRef.current=recognition;
    },[location.state]);

    const handleStop=()=>{
        console.log("녹음 정지");
        setIsListening(false);
        recognitionRef.current.stop();
        
        // 음성인식된 텍스트가 있으면 메시지 전송
        if(transcript && transcript.trim()) {
            handleMessage(transcript);
        }
    };

    const handleClick=()=>{
        console.log("마이크 버튼 클릭");
        if(isListening) {
            // 음성인식 중이면 정지
            handleStop();
        } else {
            // 음성인식 시작
            setTranscript('');
            setIsListening(true);
            recognitionRef.current.start();
        }
    };



    

    const handleMessage=async(newMessage)=>{
        console.log("input:",newMessage);
        if(newMessage){
            //보낸 메시지 추가
            setMessages(prevMessages=>[ //기존에 쌓여 있던 메시지 배열인 prevMessages 맨 뒤에 새로운 메시지 추가 
                ...prevMessages,
                {text:newMessage,type:'sent'} //보낸 메시지는 'sent'타입
            ]);
            // 입력 필드 초기화
            setTranscript('');
            try{
                setLoading(true);
                //메시지를 서버로 POST 요청 //await: 비동기 처리로 서버 응답 기다림
                const response=await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/question`,{
                    question:newMessage
                },{
                    withCredentials:true,
                    headers:{
                        "Content-Type":"application/json"
                    }
                }
            
                );

                const serverResponse=response.data.result; //서버의 응답 메시지
                console.log('서버 응답:',serverResponse);

                //서버 응답 메시지 추가
                setMessages(prevMessages=>[
                    ...prevMessages,
                    {text:serverResponse,type:'received'} //받은 메시지는 'received' 타입
                ]);
                setLoading(false);
            }catch(error){
                console.error("메시지 전송 실패",error);
                alert("메시지 전송 실패");
                setLoading(false);
            }
        }
    };
    
    useEffect(()=>{
        if(messageEndRef.current){
            messageEndRef.current.scrollIntoView({behavior:"smooth"});
        }
    },[messages]);

    useEffect(() => {
        const fetchDummyData = () => {
            setTimeout(() => {
                const dummyMessages = [
                    "궁금한게 있으면 물어봐!",
                    "마이크 버튼을 누르고 2초 정도 있다가 질문을 차근차근, 천천히 이야기해줘"
                ];

                dummyMessages.forEach(message => {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: message, type: 'received' },
                        
                    ]);
                });
            }, 1000);
        };

        fetchDummyData();
    },[]);
    
    //질문 닫기 -> 이전 페이지로 이동 
    const handleClose=()=>{
        console.log("✅returnToIndex:",returnToIndex);
        console.log("✅previousPage:",previousPage);
        
        // 이전 페이지가 study 페이지인 경우 returnToIndex와 함께 이동
        if(previousPage.includes('/study/level3')){
            navigate("/study/level3",{
                state:{
                    returnToIndex
                },
            });
        } else if(previousPage.includes('/study/level2-img')){
            navigate("/study/level2-img");
        } else if(previousPage.includes('/study/level6/summary')){
            navigate("/study/level6/summary");
        } else {
            // 다른 페이지인 경우 그냥 이동
            navigate(previousPage);
        }
    };

    const pageInfo = {
        title: "질문하기",
        subtitle: "궁금한것을 호핀이에게 물어보세요!",
    };


    return(
        <Wrapper>
            <ContentWrapper>
                <Sidebar user={user} login={login} setLogin={setLogin} defaultCollapsed={true} />
                <MainWrapper>
                <ContentContainer>
                    <BackButtonWrapper>
                        <BackButton
                            onClick={handleClose}
                        >{'<'} 이전 페이지로 돌아가기</BackButton>
                    </BackButtonWrapper>
                    
                    <QuestionArea>
                    <ChatContainer>
                        <MessageList>
                            {messages.map((msg, index) =>
                                msg.type === 'sent' ? (
                                    <Message key={index}>{msg.text}</Message>
                                ) : (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <ProfileArea>
                                            <TigerImg src={hopin} alt="샘플" />
                                        </ProfileArea>
                                        <ReceiveMessage>{msg.text}</ReceiveMessage>
                                    </div>
                                )
                                )}
                            <div ref={messageEndRef} />
                            {loading}
                        </MessageList>
                    </ChatContainer>
                    <InputArea>
                        <TextInput 
                            placeholder={isListening ? "음성인식중이에요..." : "질문을 입력하거나 마이크를 사용하세요"}
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                        />
                        <MicButton $isListening={isListening} onClick={handleClick}>
                            <MicIcon src={mic} alt="마이크 버튼"/>
                        </MicButton>
                        <SendButton onClick={() => handleMessage(transcript)}>
                            답변하기
                        </SendButton>
                    </InputArea>
                    </QuestionArea>
                </ContentContainer>
            </MainWrapper>
            </ContentWrapper>
        </Wrapper>
    );
}



export default Question;