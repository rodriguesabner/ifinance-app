import styled from "styled-components/native";

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

export const Total = styled.Text`
  font-size: 36px;
  font-weight: 500;
`;

export const Currency = styled.Text`
  font-size: 36px;
  opacity: .2;
  margin-left: 10px;
`;

export const OutcomeValue = styled.Text`
  font-size: 16px;
  margin-right: 3px;
`;
