import styled from "styled-components/native";
import {Dimensions, FlatListProps, Platform, TouchableOpacityProps} from "react-native";

interface LayoutProps {
    backgroundColor?: string;
}
export const Layout = styled.View.attrs({
})<LayoutProps>`
    flex: 1;
    background-color: #fafafa;
    padding: 10px 0;
`;

export const HeaderWrapper = styled.View`
  width: 100%;
  flex-direction: column;
`;

export const TitleHeader = styled.Text`
  color: #000;  
`;

export const TitleGreenText = styled.Text`
  color: #a1f062;
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
  padding-top: ${Platform.OS === 'android' ? 0 : '60px'};
  padding-bottom: 120px;
`;

export const FlatListMonths = styled.FlatList.attrs({
    showsHorizontalScrollIndicator: false,
})<FlatListProps<any>>`
    padding: 10px 0;
`;

interface DateWrapperProps extends TouchableOpacityProps {
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
  color: #000;
`;
