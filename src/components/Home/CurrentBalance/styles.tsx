import styled from "styled-components/native";
import {Platform} from "react-native";

export const Layout = styled.View`
    margin-bottom: 20px;
`;

export const TopContainer = styled.View`
  flex-direction: row;
`;

export const BottomContainer = styled.View`
  flex-direction: row;
  align-items: center;
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
  color: #000;
`;

export const Currency = styled.Text`
    font-size: ${Platform.OS === 'ios' ? 36 : 30}px;
    margin-left: 5px;
    opacity: 1;
    color: #555555;
`;

export const OutcomeValue = styled.Text`
  font-size: ${Platform.OS === 'ios' ? 16 : 12}px;
  margin-right: 3px;
`;

export const DescriptionTotal = styled.Text`
  color: #777;
`;
