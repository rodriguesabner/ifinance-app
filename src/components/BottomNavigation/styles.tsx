import styled from "styled-components/native";

export const Layout = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 90px;
    background-color: #000;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
`;

export const Container = styled.View`
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 30px;
    flex-direction: row;
`;

export const Item = styled.TouchableOpacity`
    align-items: center;
    margin-bottom: 10px;
    gap: 5px;
`;
