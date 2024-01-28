import styled from "styled-components/native";
import {Platform} from "react-native";

export const Layout = styled.View.attrs({
    paddingHorizontal: 20
})`
  flex: 1;
  padding-top: 40px;
  background-color: #fff;
`;

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding-top: ${Platform.OS === 'ios' ? 0 : 20}px;  
`;
