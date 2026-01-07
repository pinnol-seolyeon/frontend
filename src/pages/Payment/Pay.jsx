import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import productImage from '../../assets/finnol_pay_prouct1.svg';
import { useLocation } from 'react-router-dom';
import { requestPayment, fetchOrdererInfo, updateOrdererInfo } from '../../api/payment/paymentRequest';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
  width: 100%;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    width: 100%;
  }
`;

const RowItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FullWidthRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  gap: 1rem;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.5rem;
`;

const ProductInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const ProductImage = styled.div`
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  width: 120px;
  height: 120px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 1024px) {
    min-width: 100px;
    width: 100px;
    height: 100px;
  }
  
  @media (max-width: 768px) {
    min-width: 80px;
    width: 80px;
    height: 80px;
  }
  
  @media (max-width: 480px) {
    min-width: 60px;
    width: 60px;
    height: 60px;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const ProductName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const TagWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: #D1E8F7;
  padding: 0.25rem 0.75rem;
  border-radius: 5px;
  font-size: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 0.2rem 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
    padding: 0.15rem 0.4rem;
  }
`;

const TagMust = styled.div`
  color: #000000;
  padding: 0.25rem 0.75rem;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 200;
  border: 0.5px solid #000000;
  
`;

const Tag = styled.div`
  color: #000000;
  font-size: 12px;
  font-weight: 400;
`;

const TagContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
`;

const Quantity = styled.div`
  font-size: 14px;
  color: #000000;
  font-weight: 400;
  flex-shrink: 0;
  white-space: nowrap;
  margin-left: auto;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #676767;
  font-weight: 400;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #000000;
  font-weight: 400;
`;

const InfoValueBold = styled.div`
  font-size: 14px;
  color: #000000;
  font-weight: 600;
`;

const ModifyButton = styled.button`
  background-color: #D1E8F7;
  color: #000000;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color:rgb(183, 221, 247);
  }
`;

const SummaryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SummaryLabel = styled.div`
  font-size: 16px;
  color: #000000;
  font-weight: 300;
`;

const SummaryValue = styled.div`
  font-size: 16px;
  color: #000000;
  font-weight: 600;
`;

const TotalRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 0.5px solid #676767;
  margin-top: 0.5rem;
`;

const TotalLabel = styled.div`
  font-size: 18px;
  color: #000000;
  font-weight: 500;
`;

const TotalValue = styled.div`
  font-size: 20px;
  color: #056FB8;
  font-weight: 500;
`;

const PaymentOption = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #000000;
  font-weight: 500;
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const AgreementBox = styled.div`
  background-color: rgba(209, 232, 247, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 14px;
  color: #000000;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const PayButton = styled.button`
  width: 100%;
  background-color: #056FB8;
  color: #ffffff;
  border-radius: 2px;
  padding: 0.5rem;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: #045a9a;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #676767;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #000000;
  }
`;

const ModalInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ModalLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #056FB8;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  
  ${props => props.primary ? `
    background-color: #056FB8;
    color: #ffffff;
    
    &:hover {
      background-color: #045a9a;
    }
  ` : `
    background-color: #ffffff;
    color: #676767;
    border: 1px solid #e0e0e0;
    
    &:hover {
      background-color: #f5f5f5;
    }
  `}
`;

// Toss 위젯 스타일 커스터마이징
const TossWidgetWrapper = styled.div`
  /* Toss 위젯 컨테이너 스타일 */
  #toss-payment-method {
    /* 위젯 내부 요소 스타일 오버라이드 */
    & > * {
      font-family: inherit;
    }
    
    /* 결제 수단 선택 버튼 스타일 */
    button,
    [role="button"] {
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      transition: all 0.3s;
      
      &:hover {
        border-color: #056FB8;
        background-color: #f0f7ff;
      }
    }
    
    /* 선택된 결제 수단 스타일 */
    [aria-selected="true"],
    [data-selected="true"] {
      border-color: #056FB8;
      background-color: #D1E8F7;
    }
  }
  
  /* Toss 이용약관 위젯 스타일 */
  #toss-agreement {
    & > * {
      font-family: inherit;
      background-color: #000000;
    }
    
    /* 체크박스 스타일 */
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    
    /* 라벨 스타일 */
    label {
      font-size: 14px;
      color: #000000;
      cursor: pointer;
    }
  }
`;

function Pay({ user }) {
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreeAll, setAgreeAll] = useState(true);
  const [agreePayment, setAgreePayment] = useState(true);
  const [loading, setLoading] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const widgetsInitialized = useRef(false);
  const [ordererInfo, setOrdererInfo] = useState(null);
  const [loadingOrdererInfo, setLoadingOrdererInfo] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  
  // PaySelect에서 전달받은 정보 또는 기본값
  const quantity = location.state?.quantity || 1;
  const productPrice = location.state?.productPrice || 10000;
  const shippingFee = location.state?.shippingFee || 3000;
  const totalPrice = location.state?.totalPrice || (productPrice * quantity + shippingFee);

  // 주문자 정보 가져오기
  useEffect(() => {
    const loadOrdererInfo = async () => {
      try {
        setLoadingOrdererInfo(true);
        const info = await fetchOrdererInfo();
        setOrdererInfo(info);
        // 수정 모달용 초기값 설정
        setEditedInfo({
          name: info?.name || user?.name || '',
          phone: info?.phone || user?.phone || '',
          email: info?.email || user?.email || ''
        });
      } catch (error) {
        console.error('주문자 정보 로딩 실패:', error);
        // 에러 발생 시에도 계속 진행 (기본값 사용)
        setEditedInfo({
          name: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || ''
        });
      } finally {
        setLoadingOrdererInfo(false);
      }
    };

    loadOrdererInfo();
  }, [user]);

  // 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // 원래 값으로 복원
    setEditedInfo({
      name: ordererInfo?.name || user?.name || '',
      phone: ordererInfo?.phone || user?.phone || '',
      email: ordererInfo?.email || user?.email || ''
    });
  };

  // 정보 수정 핸들러
  const handleInfoChange = (field, value) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 전화번호 포맷팅
  const formatPhoneNumber = (value) => {
    const digitsOnly = value.replace(/[^0-9]/g, "");
    const digits = digitsOnly.slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0,3)}-${digits.slice(3)}`;
    return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
  };

  // 수정 저장
  const handleSaveInfo = async () => {
    // 유효성 검사
    if (!editedInfo.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!editedInfo.phone.trim()) {
      alert('전화번호를 입력해주세요.');
      return;
    }
    if (!editedInfo.email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedInfo.email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      // ordererId 확인
      const ordererId = ordererInfo?.id;
      if (!ordererId) {
        throw new Error('주문자 ID를 찾을 수 없습니다.');
      }

      // API 호출하여 정보 업데이트
      const updatedInfo = await updateOrdererInfo(ordererId, {
        name: editedInfo.name,
        phone: editedInfo.phone,
        email: editedInfo.email,
      });

      setOrdererInfo(updatedInfo);
      setIsModalOpen(false);
      alert('주문자 정보가 수정되었습니다.');
    } catch (error) {
      console.error('정보 업데이트 실패:', error);
      alert(error.message || '정보 수정 중 오류가 발생했습니다.');
    }
  };

  const handleAgreeAll = (checked) => {
    setAgreeAll(checked);
    setAgreePayment(checked);
  };

  // Toss Payments 초기화 및 위젯 렌더링 (숨겨진 영역에 렌더링)
  useEffect(() => {
    if (widgetsInitialized.current) return;
    
    if (window.TossPayments) {
      const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY || 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
      const tp = window.TossPayments(clientKey);
      
      // Widgets 초기화
      const customerKey = user?.userId || `customer_${Date.now()}`;
      const widgetInstance = tp.widgets({
        customerKey: customerKey,
      });
      
      setWidgets(widgetInstance);
      widgetsInitialized.current = true;
      
      // 위젯 초기화 및 렌더링 (숨겨진 영역에 렌더링)
      initializeWidgets(widgetInstance);
    } else {
      console.error('Toss Payments SDK가 로드되지 않았습니다.');
    }
  }, [user, totalPrice]);

  // 위젯 초기화 및 렌더링
  const initializeWidgets = async (widgetInstance) => {
    if (!widgetInstance) return;
    
    try {
      // 결제 금액 설정
      await widgetInstance.setAmount({
        currency: 'KRW',
        value: totalPrice,
      });

      // 결제 수단 UI 렌더링 (기존 UI 아래에 렌더링)
      await widgetInstance.renderPaymentMethods({
        selector: '#toss-payment-method',
        variantKey: 'DEFAULT',
      });

      // 이용약관 UI 렌더링 (기존 UI 아래에 렌더링)
      await widgetInstance.renderAgreement({
        selector: '#toss-agreement',
        variantKey: 'AGREEMENT',
      });
    } catch (error) {
      console.error('위젯 초기화 실패:', error);
    }
  };

  // 결제하기 버튼 클릭 - 결제 처리
  const handlePayment = async () => {
    if (!widgets) {
      alert('결제 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // Toss 위젯의 이용약관 동의는 위젯 내부에서 처리되므로 별도 체크 불필요

    setLoading(true);

    try {
      // 1. 서버에 결제 요청 전송
      const paymentData = {
        payType: 'EASY_PAY',
        amount: totalPrice,
        quantity: quantity,
        orderName: 'MONTH',
        customerEmail: ordererInfo?.email || user?.email,
        customerName: ordererInfo?.name || user?.name,
      };

      const response = await requestPayment(paymentData);
      const orderId = response.data.orderId;

      if (!orderId) {
        throw new Error('orderId가 응답에 없습니다');
      }

      // 2. Toss 결제창 호출
      // 전화번호에서 하이픈 제거
      const phoneNumber = (ordererInfo?.phone || user?.phone || '01012345678').replace(/-/g, '');
      
      await widgets.requestPayment({
        orderId: orderId,
        orderName: paymentData.orderName,
        successUrl: `${window.location.origin}/api/payment/success`,
        failUrl: `${window.location.origin}/api/payment/fail`,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
        customerMobilePhone: phoneNumber,
      });

    } catch (error) {
      console.error('결제 요청 중 오류:', error);
      
      // 에러 메시지 추출
      let errorMessage = '결제 요청 중 오류가 발생했습니다.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.originalError?.response?.data?.message) {
        errorMessage = error.originalError.response.data.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainWrapper>
      <Row style={{ flex: 2 }}>
        <Section>
            <SectionTitle>주문 상품 정보</SectionTitle>
            <ProductInfoWrapper>
            <ProductImage>
                <img src={productImage} />
            </ProductImage>
            <ProductDetails>
              <ProductName>커리큘럼 이름</ProductName>
              <TagWrapper>
                <TagContent>
                    <TagMust>필수</TagMust>
                    <Tag>- 1개월 권 -</Tag>
                </TagContent>
              
                <Quantity>
                    수량 : {quantity}
                </Quantity>
              </TagWrapper>
            </ProductDetails>
          </ProductInfoWrapper>
        </Section>

        <RowItem>
          <Section>
            <SectionHeader>
                <SectionTitle>주문자 정보</SectionTitle>
                <ModifyButton onClick={handleOpenModal}>수정</ModifyButton>
            </SectionHeader>
            <InfoRow>
              <InfoLabel>이름</InfoLabel>
              <InfoValue>
                {loadingOrdererInfo ? '로딩 중...' : (ordererInfo?.name || user?.name || '-')}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>전화번호</InfoLabel>
              <InfoValue>
                {loadingOrdererInfo ? '로딩 중...' : (ordererInfo?.phone || user?.phone || '-')}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>이메일</InfoLabel>
              <InfoValue>
                {loadingOrdererInfo ? '로딩 중...' : (ordererInfo?.email || user?.email || '-')}
              </InfoValue>
            </InfoRow>
          </Section>
        </RowItem>

      </Row>

      <Row style={{ flex: 1.5 }}>
        <RowItem>
          <Section>
            <SectionTitle>주문 요약</SectionTitle>
            <SummaryRow>
              <SummaryLabel>상품가격</SummaryLabel>
              <SummaryValue>{(productPrice * quantity).toLocaleString()}원</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>배송비</SummaryLabel>
              <SummaryValue>+ {shippingFee.toLocaleString()}원</SummaryValue>
            </SummaryRow>
            <TotalRow>
              <TotalLabel>총 주문금액</TotalLabel>
              <TotalValue>{totalPrice.toLocaleString()}원</TotalValue>
            </TotalRow>
          </Section>
        </RowItem>
        <RowItem>
          <Section>
            {/* Toss Payments 위젯이 렌더링될 영역 (기존 UI 대신 사용) */}
            <TossWidgetWrapper>
              <div id="toss-payment-method"></div>
            </TossWidgetWrapper>
          </Section>
        </RowItem>
        </Row>
        <Row style={{ flex: 1.5 }}>
        <RightColumn>
          <AgreementBox>
            {/* Toss Payments 이용약관 위젯이 렌더링될 영역 */}
            <TossWidgetWrapper>
              <div id="toss-agreement"></div>
            </TossWidgetWrapper>
          </AgreementBox>
          <PayButton 
            onClick={handlePayment}
            disabled={loading || !widgets}
          >
            {loading ? '결제 중...' : '결제하기'}
          </PayButton>
        </RightColumn>
      </Row>

      {/* 주문자 정보 수정 모달 */}
      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>주문자 정보 수정</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>

            <ModalInputWrapper>
              <ModalLabel>이름</ModalLabel>
              <ModalInput
                type="text"
                value={editedInfo.name}
                onChange={(e) => handleInfoChange('name', e.target.value)}
                placeholder="이름을 입력해주세요"
                maxLength={20}
              />
            </ModalInputWrapper>

            <ModalInputWrapper>
              <ModalLabel>전화번호</ModalLabel>
              <ModalInput
                type="text"
                value={editedInfo.phone}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  handleInfoChange('phone', formatted);
                }}
                placeholder="010-1234-5678"
                maxLength={13}
              />
            </ModalInputWrapper>

            <ModalInputWrapper>
              <ModalLabel>이메일</ModalLabel>
              <ModalInput
                type="email"
                value={editedInfo.email}
                onChange={(e) => handleInfoChange('email', e.target.value)}
                placeholder="example@email.com"
              />
            </ModalInputWrapper>

            <ModalButtonGroup>
              <ModalButton onClick={handleCloseModal}>취소</ModalButton>
              <ModalButton primary onClick={handleSaveInfo}>저장</ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </MainWrapper>
  );
}

export default Pay;
