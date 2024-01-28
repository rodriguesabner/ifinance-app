import styled from "styled-components/native";
import {TouchableOpacityProps} from "react-native";

export const Layout = styled.View`
`;

export const WrapperActions = styled.FlatList.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
})`
  
`;

interface ActionItemProps extends TouchableOpacityProps {
    backgroundColor?: string;
}

export const ActionItem = styled.TouchableOpacity<ActionItemProps>`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.backgroundColor != null ? props.backgroundColor : "#eaeee8"};
    height: 30px;
    margin-right: 15px;
    gap: 5px;
    border-radius: 20px;
    padding: 0 20px;
`;

export const ActionIcon = styled.View`
  align-items: center;
  justify-content: center;
`;

export const ActionText = styled.Text`
    color: #1e5b02;
    text-align: center;
    font-weight: bold;
`;
