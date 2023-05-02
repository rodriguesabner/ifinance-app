import styled from "styled-components/native";
import {Platform} from "react-native";

export const Layout = styled.View`
  margin-top: 36px;
  align-items: center;
  justify-content: center;
`;

export const TopContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;

export const BottomContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  opacity: .5;
`;

type TotalProps = {
    color?: string;
}

export const Total = styled.Text<TotalProps>`
  font-size: ${Platform.OS === 'ios' ? 36 : 30}px;
  font-weight: 500;
  border-radius: 20px;
  color: ${(props) => props.color || '#629a86'};
`;

export const Currency = styled.Text`
  font-size: ${Platform.OS === 'ios' ? 36 : 30}px;
  opacity: .2;
  margin-left: 10px;
`;

export const OutcomeValue = styled.Text`
  font-size: ${Platform.OS === 'ios' ? 16 : 12}px;
  margin-right: 3px;
`;
