/**
 * SSE(Server-Sent Events)를 사용한 스트리밍 채팅 클라이언트
 * 토큰 갱신 및 재연결 로직 포함
 */

/**
 * SSE 연결을 생성하고 관리하는 함수
 * @param {string} question - 사용자 질문
 * @param {Function} onMessage - 메시지 수신 시 호출되는 콜백 (delta 텍스트 조각)
 * @param {Function} onEnd - 스트림 종료 시 호출되는 콜백
 * @param {Function} onError - 에러 발생 시 호출되는 콜백
 * @returns {Function} cleanup 함수 (연결 종료용)
 */
export const connectSSE = async (question, onMessage, onEnd, onError) => {
    const baseURL = process.env.REACT_APP_API_BASE_URL || '';
    
    try {
        // SSE 연결 직전에 토큰 갱신 (에러 무시)
        console.log('🔄 토큰 갱신 시도...');
        try {
            await fetch(`${baseURL}/health-check`, { 
                credentials: "include" 
            });
            console.log('✅ 토큰 갱신 완료');
        } catch (error) {
            console.log('⚠️ health-check 실패 (무시하고 진행):', error.message);
        }
        
        // fetch API를 사용한 SSE 스트림 읽기 (쿠키 포함)
        const encodedQuestion = encodeURIComponent(question);
        const url = `${baseURL}/api/question/stream?question=${encodedQuestion}`;
        
        console.log('📡 SSE 연결 시작:', url);
        
        const controller = new AbortController();
        let isClosed = false;
        
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include', // 쿠키 포함
            headers: {
                'Accept': 'text/event-stream',
            },
            signal: controller.signal,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('✅ SSE 연결 성공');
        
        // 스트림 읽기
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        const readStream = async () => {
            try {
                while (!isClosed) {
                    const { done, value } = await reader.read();
                    
                    if (done) {
                        console.log('✅ 스트림 완료');
                        if (onEnd) onEnd();
                        break;
                    }
                    
                    // 청크를 디코딩하여 버퍼에 추가
                    buffer += decoder.decode(value, { stream: true });
                    
                    // SSE 형식으로 파싱 (event: 와 data: 로 시작하는 라인들)
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // 마지막 불완전한 라인은 버퍼에 남김
                    
                    let currentEvent = 'message';
                    
                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        
                        if (trimmedLine.startsWith('event:')) {
                            // 이벤트 타입 설정
                            currentEvent = trimmedLine.substring(6).trim();
                            console.log('📢 이벤트 타입:', currentEvent);
                            
                            // event:end를 받으면 즉시 스트림 종료
                            if (currentEvent === 'end') {
                                console.log('✅ 스트림 종료 신호 (event:end) - 이후 데이터 무시');
                                if (onEnd) onEnd();
                                isClosed = true;
                                // reader 즉시 닫기
                                try {
                                    reader.cancel();
                                } catch (e) {
                                    console.log('reader cancel 중 에러 (무시):', e);
                                }
                                return; // readStream 함수 완전히 종료
                            }
                        } else if (trimmedLine.startsWith('data:')) {
                            const data = trimmedLine.substring(5).trim();
                            
                            console.log(`📩 [${currentEvent}]`, data);
                            
                            // 이벤트 타입에 따라 처리
                            if (currentEvent === 'message') {
                                if (onMessage) onMessage(data);
                            } else if (currentEvent === 'end') {
                                console.log('✅ 스트림 종료 신호 (data) - 이후 데이터 무시');
                                if (onEnd) onEnd();
                                isClosed = true;
                                // reader 즉시 닫기
                                try {
                                    reader.cancel();
                                } catch (e) {
                                    console.log('reader cancel 중 에러 (무시):', e);
                                }
                                return; // readStream 함수 완전히 종료
                            } else if (currentEvent === 'expired') {
                                console.log('⚠️ 토큰 만료 감지 → 자동 재연결');
                                isClosed = true;
                                
                                // 토큰 재발급 및 재연결
                                try {
                                    await fetch(`${baseURL}/health-check`, { 
                                        credentials: "include" 
                                    }).catch(() => {});
                                    
                                    setTimeout(() => {
                                        console.log("🔄 SSE 재연결 시도...");
                                        connectSSE(question, onMessage, onEnd, onError);
                                    }, 1000);
                                } catch (err) {
                                    console.error("❌ 토큰 재발급 실패:", err);
                                    if (onError) onError(err);
                                }
                                return; // readStream 함수 완전히 종료
                            }
                            
                            // 다음 줄을 위해 이벤트 타입 리셋
                            currentEvent = 'message';
                        }
                    }
                }
                
                reader.releaseLock();
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('🛑 스트림 중단됨');
                } else {
                    console.error('❌ 스트림 읽기 에러:', error);
                    if (onError) onError(error);
                }
            }
        };
        
        // 스트림 읽기 시작
        readStream();
        
        // cleanup 함수 반환
        return () => {
            console.log("🛑 SSE 연결 종료");
            isClosed = true;
            controller.abort();
        };
        
    } catch (error) {
        console.error("❌ SSE 연결 초기화 실패:", error);
        if (onError) {
            onError(error);
        }
        return () => {}; // noop cleanup
    }
};

