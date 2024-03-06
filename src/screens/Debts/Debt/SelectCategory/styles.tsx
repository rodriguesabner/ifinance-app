import styled from "styled-components/native";
import {FlatListProps, Platform} from "react-native";

export const Container = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: {
        paddingBottom: 120
    },
})`
    flex: 1;
    background-color: #fff;
    padding: 60px 20px;
    padding-top: ${Platform.OS === 'android' ? 30 : 60}px;
`;

export const BackButton = styled.TouchableOpacity`
    background-color: #a0e673;
    margin-bottom: 20px;
    width: 40px;
    height: 40px;
    border-radius: 500px;
    justify-content: center;
    align-items: center;
`;

export const Form = styled.View`
    margin-top: 20px;
    gap: 20px;
`;

export const Label = styled.Text`
    color: #999;
    margin-bottom: 5px;
`;

export const Input = styled.TextInput.attrs({
    placeholderTextColor: '#999',
    returnKeyType: 'done',
})`
    background-color: #eaeee8;
    height: 42px;
    padding-left: 10px;
    border-radius: 4px;
    width: 100%;
    color: #000;
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 20px;
`;

export const CancelButton = styled.TouchableOpacity`
    background-color: #eaeee8;
    height: 48px;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    flex-direction: row;
    width: 47%;
`;

export const Button = styled.TouchableOpacity`
    background-color: #a0e76d;
    height: 48px;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    flex-direction: row;
    width: 47%;
`;

interface TextCurrentCategoryProps {
    color?: string;
}
export const TextCurrentCategory = styled.Text<TextCurrentCategoryProps>`
  color: ${(props) => props.color || '#999'};
`;

export const WrapperCurrency = styled.View`
  flex-direction: row;
  height: 42px;
  align-items: center;
  width: 100%;
  background-color: #fafafa;
  border-radius: 4px;
`;

export const WrapperPrices = styled.FlatList.attrs({
    showsHorizontalScrollIndicator: false,
    horizontal: true,
})<FlatListProps<any>>`
`;

export const PriceItem = styled.TouchableOpacity`
    background-color: #eaeee8;
    padding: 10px 14px;
    border-radius: 20px;
`;

export const CurrentCategory = styled.TouchableOpacity`
    background-color: #eaeee8;
    height: 42px;
    padding-left: 10px;
    border-radius: 4px;
    width: 100%;
    padding-top: 15px;
`;
