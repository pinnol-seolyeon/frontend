import styled from "styled-components"


const StyledButton = styled.div`
    display: flex;
    align-items: center;
    justify-content:center;


    // width:90px;
    // height:40px;
    padding:0.9em 1.2em;
    // gap:8px;


    background-color : #FEF3E1;
    border-radius : 20px;
    border: none;

    font-size:18px;
    color:black;

    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #fbd8a8;
    }

    &:active {
        background-color: #f5c77a;
    }
`;



function Button({children,onClick,className}){

    return(
        <StyledButton onClick={onClick} className={className}>
            {children}
        </StyledButton>
    );
}

export default Button;