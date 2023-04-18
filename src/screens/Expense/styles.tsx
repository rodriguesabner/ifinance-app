import styled from "styled-components/native";
import {FlatListProps, Platform} from "react-native";

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

export const CurrentCategory = styled.TouchableOpacity`
  background-color: #fafafa;
  height: 42px;
  padding-left: 10px;
  border-radius: 4px;
  width: 100%;
  padding-top: 15px;
`;

interface TextCurrentCategoryProps {
    color?: string;
}
export const TextCurrentCategory = styled.Text<TextCurrentCategoryProps>`
  color: ${(props) => props.color || '#999'};
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

export const WrapperCurrency = styled.View`
  flex-direction: row;
  height: 42px;
  align-items: center;
  width: 100%;
  background-color: #fafafa;
  border-radius: 4px;
`;

export const CurrencyFormat = styled.Text`
  padding-left: 10px;
  height: 100%;
  text-align: center;
  align-items: center;
  padding-top: 13px;
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

export const WrapperPrices = styled.FlatList.attrs({
    showsHorizontalScrollIndicator: false,
    horizontal: true,
})<FlatListProps<any>>`
`;

export const PriceItem = styled.TouchableOpacity`
  background-color: #f4f3f6;
  padding: 10px 14px;
  border-radius: 20px;
`;
