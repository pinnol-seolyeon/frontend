/**
 * AI에게 질문을 전송하고 스트리밍 응답을 받는 API
 * @param {string} question - 사용자의 질문 내용
 * @param {Function} onMessage - 메시지를 받을 때마다 호출되는 콜백 함수
 * @param {Function} onError - 에러 발생시 호출되는 콜백 함수
 * @param {Function} onComplete - 스트림이 완료되면 호출되는 콜백 함수
 * @returns {Function} cleanup 함수 (연결을 종료할 때 사용)
 */
export const streamQuestionToAI = async (question, onMessage, onError, onComplete) => {
    const baseURL = process.env.REACT_APP_API_BASE_URL || '';
    const encodedQuestion = encodeURIComponent(question);
    const url = `${baseURL}/api/question/stream?question=${encodedQuestion}`;

    let aborted = false;
    const controller = new AbortController();

    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include', // 쿠키 포함
            headers: {
                'Accept': 'text/event-stream',
            },
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        // 스트림 읽기
        while (!aborted) {
            const { done, value } = await reader.read();
            
            if (done) {
                console.log('✅ 스트림 완료');
                if (onComplete) onComplete();
                break;
            }

            // 청크를 디코딩하여 버퍼에 추가
            buffer += decoder.decode(value, { stream: true });
            
            // SSE 형식으로 파싱 (data: 로 시작하는 라인들)
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 마지막 불완전한 라인은 버퍼에 남김

            for (const line of lines) {
                const trimmedLine = line.trim();
                
                if (trimmedLine.startsWith('data: ')) {
                    const data = trimmedLine.substring(6); // 'data: ' 제거
                    
                    if (data === '[DONE]') {
                        console.log('✅ 스트림 완료 신호 수신');
                        if (onComplete) onComplete();
                        aborted = true;
                        break;
                    }
                    
                    try {
                        // JSON 파싱 시도
                        const parsed = JSON.parse(data);
                        if (onMessage) onMessage(parsed);
                    } catch (e) {
                        // JSON이 아닌 경우 텍스트 그대로 전달
                        if (data && onMessage) {
                            onMessage({ content: data });
                        }
                    }
                } else if (trimmedLine) {
                    // data: 가 없는 일반 텍스트도 처리
                    if (onMessage) {
                        onMessage({ content: trimmedLine });
                    }
                }
            }
        }

        reader.releaseLock();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('🛑 스트림 중단됨');
        } else {
            console.error('❌ 스트림 에러:', error);
            if (onError) onError(error);
        }
    }

    // cleanup 함수 반환
    return () => {
        aborted = true;
        controller.abort();
    };
};

/**
 * EventSource를 사용한 대안 구현 (쿠키 자동 전송)
 * 단, 커스텀 헤더를 설정할 수 없음
 */
export const streamQuestionToAIWithEventSource = (question, onMessage, onError, onComplete) => {
    const baseURL = process.env.REACT_APP_API_BASE_URL || '';
    const encodedQuestion = encodeURIComponent(question);
    const url = `${baseURL}/api/question/stream?question=${encodedQuestion}`;

    const eventSource = new EventSource(url, {
        withCredentials: true // 쿠키 포함
    });

    eventSource.onmessage = (event) => {
        console.log('📩 메시지 수신:', event.data);
        
        if (event.data === '[DONE]') {
            console.log('✅ 스트림 완료');
            eventSource.close();
            if (onComplete) onComplete();
            return;
        }

        try {
            const parsed = JSON.parse(event.data);
            if (onMessage) onMessage(parsed);
        } catch (e) {
            // JSON이 아닌 경우 텍스트 그대로 전달
            if (onMessage) {
                onMessage({ content: event.data });
            }
        }
    };

    eventSource.onerror = (error) => {
        console.error('❌ EventSource 에러:', error);
        eventSource.close();
        if (onError) onError(error);
    };

    // cleanup 함수 반환
    return () => {
        eventSource.close();
    };
};
