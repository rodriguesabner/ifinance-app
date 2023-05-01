import styled from "styled-components/native";
import {Dimensions, FlatListProps} from "react-native";

interface LayoutProps {
    backgroundColor?: string;
}
export const Layout = styled.View.attrs({
})<LayoutProps>`
  flex: 1;
  background-color: ${(props) => props.backgroundColor || '#ccf0e3'};
`;

export const LoadingWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
`;

export const FlatList = styled.FlatList.attrs({
    showsVerticalScrollIndicator: false,
})<FlatListProps<any>>`
  flex: 1;
  padding-top: 60px;
  padding-bottom: 120px;
`;

export const FlatListMonths = styled.FlatList.attrs({
    showsHorizontalScrollIndicator: false,
})<FlatListProps<any>>`
    padding: 10px 0;
`;

export const WrapperActions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 36px;
  margin: 36px 0;
`;

export const ActionItem = styled.TouchableOpacity`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ActionIcon = styled.View`
  background-color: #333333;
  width: 70px;
  height: 70px;
  border-radius: 500px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

interface DateWrapperProps {
    isActive?: boolean;
}

export const DateWrapper = styled.TouchableOpacity<DateWrapperProps>`
  background-color: ${(props) => props.isActive ? 'rgba(131,131,131,0.45)' : 'rgba(131, 131, 131, 0.16)'};
  padding: 9px;
  border-radius: 10px;
  margin-top: 10px;
`;

export const DateText = styled.Text`
  font-size: 15px;
  font-weight: 500;
`;
