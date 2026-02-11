import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import userimg from '../../assets/user.svg';
import pencilIcon from '../../assets/mypage_edit.svg';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 0;
  padding: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const MainWrapper = styled.div` 
  flex: 1;
  min-height: calc(100vh - var(--header-height, 70px));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: flex-start;
  margin-bottom: 2rem;
`;

const TitleText = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #191919;
`;

const SubTitleText = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #191919;
  margin-bottom: 1rem;
`;

const ProfileCard = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 3rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #FBFBFB;
`;

const ProfileCardHeading = styled.h3`
  font-size: 16px;
  font-weight: 300;
  color: #454953;
  margin: 0;
`;

const ProfileContentRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4rem;
`;

const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const ProfileAvatar = styled.div`
  width: 7rem;
  height: 7rem;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarEditButton = styled.button`
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #056FB8;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

  img {
    width: 20px;
    filter: brightness(0) invert(1);
  }

  &:hover {
    background: #4a8bc2;
  }
`;

const ProfileForm = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  padding: 0.25rem 0;
`;

const InfoLabel = styled.span`
  font-size: 16px;
  font-weight: 300;
  color: #454953;
  min-width: 140px;
  flex-shrink: 0;
`;

const InfoInput = styled.input`
  flex: 1;
  min-width: 0;
  max-width: 60%;
  padding: 0.5rem 0.75rem;
  font-size: 16px;
  font-weight: 500;
  color: #191919;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #5B9BD5;
  }
`;

const ProfileCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const CompleteButton = styled.button`
  padding: 0.6rem 1.5rem;
  background: #D1E8F7;
  color: #191919;
  font-size: 15px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #b8d4f1;
  }
`;

const formatPhone = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 11 && digits.startsWith('010')) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
  if (digits.length >= 10 && digits.startsWith('010')) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length >= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length >= 4) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return digits;
};

/** 입력 중 전화번호에 하이픈 자동 삽입 (010 최대 11자리) */
const formatPhoneInput = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGE_SIZE_MB = 5;

const Mypage_profileedit = ({ user, login, setLogin }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(formatPhone(user?.phone) || '');
  const [parentName, setParentName] = useState(user?.parentName ?? '');
  const [parentPhone, setParentPhone] = useState(formatPhone(user?.parentPhone) || '');
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImage ?? null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  useEffect(() => {
    return () => {
      if (profileImageUrl && profileImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [profileImageUrl]);

  const handleAvatarEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      alert('이미지 파일만 선택해 주세요. (JPEG, PNG, GIF, WebP)');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`이미지 크기는 ${MAX_IMAGE_SIZE_MB}MB 이하여야 합니다.`);
      e.target.value = '';
      return;
    }

    if (profileImageUrl && profileImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(profileImageUrl);
    }
    const nextUrl = URL.createObjectURL(file);
    setProfileImageUrl(nextUrl);
    setProfileImageFile(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/mypage');
    // TODO: API 연동 시 profileImageFile을 FormData에 담아 전송
    // const formData = new FormData();
    // if (profileImageFile) formData.append('profileImage', profileImageFile);
    // formData.append('name', name); ...
  };

  return (
    <Wrapper>
      <ContentWrapper>
        <Sidebar user={user} login={login} setLogin={setLogin} />
        <MainWrapper>
          <TitleWrapper>
            <TitleText>마이페이지</TitleText>
          </TitleWrapper>
          <SubTitleText>프로필 수정</SubTitleText>
          <ProfileCard>
            <ProfileCardHeading>프로필</ProfileCardHeading>
            <ProfileContentRow>
              <AvatarWrapper>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={handleProfileImageChange}
                  style={{ display: 'none' }}
                  aria-hidden="true"
                />
                <ProfileAvatar>
                  <img src={profileImageUrl || userimg} alt="프로필" />
                </ProfileAvatar>
                <AvatarEditButton
                  type="button"
                  title="프로필 사진 수정"
                  onClick={handleAvatarEditClick}
                >
                  <img src={pencilIcon} alt="수정" />
                </AvatarEditButton>
              </AvatarWrapper>
              <ProfileForm>
                <InfoRow>
                  <InfoLabel>내 이름</InfoLabel>
                  <InfoInput
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                  />
                </InfoRow>
                <InfoRow>
                  <InfoLabel>내 전화번호</InfoLabel>
                  <InfoInput
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                    placeholder="010-0000-0000"
                  />
                </InfoRow>
                <InfoRow>
                  <InfoLabel>부모님 성함</InfoLabel>
                  <InfoInput
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="부모님 성함을 입력하세요"
                  />
                </InfoRow>
                <InfoRow>
                  <InfoLabel>부모님 전화번호</InfoLabel>
                  <InfoInput
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(formatPhoneInput(e.target.value))}
                    placeholder="010-0000-0000"
                  />
                </InfoRow>
              </ProfileForm>
            </ProfileContentRow>
            <ProfileCardFooter>
              <CompleteButton type="button" onClick={handleSubmit}>
                수정 완료
              </CompleteButton>
            </ProfileCardFooter>
          </ProfileCard>
        </MainWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Mypage_profileedit;