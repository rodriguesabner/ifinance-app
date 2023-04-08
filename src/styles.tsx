import styled from "styled-components/native";

interface LayoutProps {
    backgroundColor?: string;
}
export const Layout = styled.View<LayoutProps>`
  flex: 1;
  background-color: ${(props) => props.backgroundColor || '#ccf0e3'};
`;
