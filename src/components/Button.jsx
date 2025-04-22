import styled from "styled-components"


const StyledButton = styled.div`
    display: flex;
    align-items: center;
    justify-content:center;


    width:90px;
    height:40px;
    // padding: 10px
    // gap:8px;


    background-color : #FEF3E1;
    border-radius : 30px;
    border:0.5px solid black;

    font-size:10px;
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