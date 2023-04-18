import styled from "styled-components/native";
import {Platform} from "react-native";

export const Container = styled.KeyboardAvoidingView.attrs({
    behavior: Platform.OS === 'ios' ? 'padding' : undefined,
})`
  flex: 1;
  background-color: #fff;
  padding: 60px 20px;
`;

export const Form = styled.View`
  margin-top: 20px;
  gap: 20px;
`;

export const Label = styled.Text`
  color: #666;
  margin-bottom: 5px;
`;

interface InputTextProps {
    isEmpty?: boolean;
}

export const InputText = styled.Text<InputTextProps>`
  background-color: #fafafa;
  height: 42px;
  padding-left: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  color: ${(props) => (props.isEmpty ? '#999' : '#000')};
`;

export const Input = styled.TextInput.attrs({
    placeholderTextColor: '#999',
    returnKeyType: 'done',
})`
  background-color: #fafafa;
  height: 42px;
  padding-left: 10px;
  border-radius: 4px;
  width: 100%;
`;

export const Button = styled.TouchableOpacity`
  background-color: #333333;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-top: 36px;
  flex-direction: row;
`;
