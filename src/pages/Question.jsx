import React,{useState,useEffect,useRef} from 'react';
import {useNavigate} from 'react-router-dom';

import styled,{keyframes} from "styled-components";
import axios from 'axios';

import Header from "../components/Header";
import Box from "../components/Box";
import tiger from "../assets/tiger-upperbody1.png";
import me from "../assets/me.png";
import mic from "../assets/mic.png";

/*질문 버튼 눌렀을 때*/


const Wrapper=styled.div`
    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

`;

const QuestionWrapper=styled.div`
    flex-grow:1;
    overflow-y:auto;
    display:flex;
    flex-direction:column;
    align-items:center;
    // padding-bottom:12vh;
`

///페이드인 애니메이션 정의 
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
    margin-bottom:20px;
    flex-grow:1;
    overflow-y:auto;
    display:flex;
    flex-direction:column;
    align-items:flex-end;
`;


const TigerImg=styled.img`
    width:10%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    max-width:70px;
    display:block;
    
    align-self:flex-start;
    margin-top:10px;
    margin-bottom:0px;

`;

const MyImg=styled.img`
    width:10%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    max-width:60px;
    display:block;

    align-self:flex-end;
    margin-top:10px;
    margin-right:10px;

`;

const ReceiveMessage = styled.div`
    background-color: #FEF3E1;
    border-top: 0.2px solid black;
    border-bottom: 0.2px solid black;
    border-right: 0.2px solid black;

    border-radius: 0px 30px 30px 0px;
    padding: 20px;
    font-weight: bold;

    margin-bottom: 10px;
    max-width: 60%;
    word-wrap: break-word;
    align-self: flex-start;
    white-space: pre-wrap;
    animation: ${fadeIn} 0.5s ease-out;
`;

const Message=styled.div`
    background-color:#FBC344;
    border-top: 0.2px solid black;
    border-bottom: 0.2px solid black;
    border-left: 0.2px solid black;
    
    border-radius:30px 0px 0px 30px;
    padding:20px;
    font-weight: bold;

    margin-bottom:10px;
    margin-top:5px;

    max-width:60%;
    word-wrap:break-word; 
    align-self:flex-end;
    white-space:pre-wrap;
    animation:${fadeIn} 0.5s ease-out;
`;

const MicButton=styled.button`
    background:none;
    border:none;
    padding:0;
    cursor:pointer;

    margin-bottom:20px;
`;

const MicIcon=styled.img`
    width:80px;
    height:auto;
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


function Question({}){
    
    const[messages,setMessages]=useState([]);
    const messageEndRef=useRef(null);
    const[loading,setLoading]=useState(false);
    const[isListening,setIsListening]=useState(false);
    const[transcript,setTranscript]=useState(''); //음성 인식 결과
    const recognitionRef=useRef(null); //recognition 매번 호출 비효율 문제 해결
    const navigate=useNavigate();

    //컴포넌트가 처음 마운트될 때 한 번만 실행됨 
useEffect(()=>{
    //Web Speech API 설정
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    const recognition=new SpeechRecognition();
    recognition.lang='ko-KR';
    recognition.continuous=true;
    recognition.interimResults=true;

    


    //사용자가 말하는 내용을 실시간으로 transcript에 저장 
    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setTranscript(transcript);
      };
    recognitionRef.current=recognition;
},[]);
      

    const handleStop=()=>{
        console.log("녹음 정지");
        setIsListening(false);
        recognitionRef.current.stop();
        // onRecordComplete(transcript); //인식된 transcript를 부모 컴포넌트로 넘김
        handleMessage(transcript);
    };

    const handleClick=()=>{
        console.log("마이크 버튼 클릭");
        setTranscript('');
        setIsListening(true); //MicButton 사라지고 TranscriptBox 보이게 
        recognitionRef.current.start();
    };




    

    const handleMessage=async(newMessage)=>{
        console.log("input:",newMessage);
        if(newMessage){
            //보낸 메시지 추가
            setMessages(prevMessages=>[
                ...prevMessages,
                {text:newMessage,type:'sent'} //보낸 메시지는 'sent'타입
            ]);
            try{
                setLoading(true);
                //메시지를 서버로 POST 요청
                const response=await axios.post('http://localhost:8080/api/question',{
                    message:newMessage
                });

                const serverResponse=response.data.response; //서버의 응답 메시지
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
                    "테스트 ✏️"
                ];

                dummyMessages.forEach(message => {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: message, type: 'received' },
                        { text: message, type: 'sent' }
                    ]);
                });
            }, 1000);
        };

        fetchDummyData();
    },[]);

    return(
        
    <>
        <Wrapper>
            <Box>
                <QuestionWrapper>
                    <MessageList>
                        {messages.map((msg, index) =>
                            msg.type === 'sent' ? (
                                <>
                                    <MyImg src={me} alt="샘플" />
                                    <Message key={index}>{msg.text}</Message>
                                </>
                            ) : (
                                <>
                                    <TigerImg src={tiger} alt="샘플" />
                                    <ReceiveMessage key={index}>{msg.text}</ReceiveMessage>
                                </>
                            )
                            )}
                        <div ref={messageEndRef} />
                        {loading}
                    </MessageList>
                </QuestionWrapper>
                {isListening?(
                    <TranscriptWrapper>
                        <TranscriptBox>{transcript||"음성 인식 중.."}</TranscriptBox>
                        <StopButton onClick={handleStop}>정지</StopButton>
                    </TranscriptWrapper>
                ):(
                    <MicButton onClick={handleClick}>
                        <MicIcon src={mic} alt="마이크 버튼"/>
                    </MicButton>
                )}
            </Box>
        </Wrapper>
    </>
    );
}



export default Question;