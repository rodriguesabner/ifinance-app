import styled from "styled-components/native";
import {Platform} from "react-native";

export const Layout = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const AppTitle = styled.Text`
  font-size: ${Platform.OS === 'ios' ? 20 : 18}px;
  font-weight: 500;
  opacity: .3;
  color: #fff;
`;

export const ControlTitle = styled.Text`
  font-size: ${Platform.OS === 'ios' ? 30 : 26}px;
  font-weight: 600;
  color: #fff;
`;
