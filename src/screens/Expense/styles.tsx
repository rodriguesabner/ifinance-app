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

export const Form = styled.View`
  margin-top: 20px;
  gap: 20px;
`;

export const Label = styled.Text`
  color: #666;
  margin-bottom: 5px;
`;

export const CurrentCategory = styled.TouchableOpacity`
  background-color: #3e3e3e;
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
