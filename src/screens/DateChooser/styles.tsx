import styled from "styled-components/native";

interface LayoutProps {
    backgroundColor?: string;
}
export const Layout = styled.View.attrs({
})<LayoutProps>`
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #fff;
    padding: 40px 0;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
`;

export const Header = styled.View`
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding-right: 40px;
`;

export const Button = styled.TouchableOpacity`
    background-color: #eaeee8;
    border-radius: 10px;
    padding: 7px;
`;

export const Month = styled.View`
    background-color: #f1f3f6;
    width: 30%;
    padding: 10px;
    border-radius: 4px;
`;
