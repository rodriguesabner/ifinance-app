import styled from "styled-components/native";

export const Layout = styled.View.attrs({
})`
    flex: 1;
    background-color: #fff;
    padding: 10px 0;
`;


export const Header = styled.View`
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
`;

export const Button = styled.TouchableOpacity`
    background-color: #eaeee8;
    border-radius: 10px;
    padding: 7px;
`;
