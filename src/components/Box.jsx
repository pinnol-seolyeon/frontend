// components/Box.jsx
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";

const StyleBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 40rem;
  height: auto;
  padding: 2rem;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  box-sizing: border-box;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.div`
  font-size: 40px;
  font-weight: 700;
  color: #131426;
  margin-bottom: 1rem;
  text-align: center;
`;

const SubTitleText = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: #131426;
  margin-bottom: 2rem;
  text-align: center;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333;
  font-weight: 700;
  min-width: 60px;
  flex-shrink: 0;
`;

const StyledInput = styled.input`
  border: none;
  background-color: #F7F7F7;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
  outline: none;
  color: #333;
  flex: 1;
  
  &::placeholder {
    color: #9E9E9E;
  }
  
  &:focus {
    background-color: #F0F0F0;
  }
`;

const CustomSelectWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const StyledSelect = styled.div`
  background-color: #F7F7F7;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  &:focus {
    border-color: #4285F4;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
    background-color: #F0F0F0;
  }

  &:placeholder {
    color: #9E9E9E;
  }
  
  &:hover {
    border-color: #4285F4;
  }
`;

const DropdownArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #666;
  transition: transform 0.2s;
  
  ${props => props.isOpen && `
    transform: rotate(180deg);
  `}
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
`;

const DropdownOption = styled.div`
  padding: 12px 16px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #F5F5F5;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  
  &:only-child {
    border-radius: 8px;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  
  input[type="radio"] {
    width: 16px;
    height: 16px;
    accent-color: #4285F4;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #3367D6;
  }
  
  &:active {
    background-color: #2E5ACF;
  }
`;

// 커스텀 드롭다운 컴포넌트
function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <CustomSelectWrapper ref={dropdownRef}>
      <StyledSelect onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <DropdownArrow isOpen={isOpen} />
      </StyledSelect>
      {isOpen && (
        <DropdownList>
          {options.map((option) => (
            <DropdownOption
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </DropdownOption>
          ))}
        </DropdownList>
      )}
    </CustomSelectWrapper>
  );
}

function Box({ children, title, subtitle, showForm = false }) {
  return (
    <StyleBox>
      {title && <TitleText>{title}</TitleText>}
      {subtitle && <SubTitleText>{subtitle}</SubTitleText>}
      {children}
    </StyleBox>
  );
}

export default Box;
export { TitleText, SubTitleText, InputWrapper, Label, StyledInput, CustomSelect, RadioGroup, RadioOption, StyledButton };  