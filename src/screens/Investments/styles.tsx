import styled from "styled-components/native";
import {Platform} from "react-native";

export const Layout = styled.View.attrs({
    paddingHorizontal: 20
})`
  flex: 1;
  padding-top: 40px;
  background-color: #222222;
`;

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding-top: ${Platform.OS === 'ios' ? 0 : 20}px;  
`;

export const TotalInput = styled.TextInput`
  font-size: ${Platform.OS === 'ios' ? 46 : 40}px;
  font-weight: 500;
  border-radius: 20px;
  color: #ffffff;
  margin-left: 10px;
  width: 100%;
`;

export const TextResult = styled.Text`
  font-size: 16px;
  color: #ffffff;
  margin-top: 10px;
  margin-bottom: 10px;
  max-width: 80%;
`;

export const TextResultBold = styled.Text`
  font-size: 16px;
  color: #ffffff;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: bold;
`;

export const Button = styled.TouchableOpacity`
  background-color: #a1f062;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  flex-direction: row;
  width: 40%;
  margin-bottom: 40px;
`;

export const EraseButton = styled.TouchableOpacity`
  background-color: #f06262;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  flex-direction: row;
  width: 40%;
  margin-bottom: 40px;
`;

export const TwoColumns = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;
