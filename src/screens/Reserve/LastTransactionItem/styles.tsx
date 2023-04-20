import styled from "styled-components/native";

interface LayoutProps {
    backgroundColor?: string;
}
export const Layout = styled.TouchableOpacity<LayoutProps>`
  background-color: #fff;
  padding: 30px 20px;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 20px;
  align-items: center;
  
  border-bottom-width: 1px;
  border-bottom-color: #e5e5e5;
`;

export const LeftWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DateTransaction = styled.Text`
  font-size: 14px;
  margin-bottom: 15px;
`;

export const Container = styled.View`
  
`;

export const TitleTransaction = styled.Text`
  font-weight: 600;
  font-size: 16px;
  max-width: 200px;
`;

export const Category = styled.Text`
  opacity: .3;
  font-size: 14px;
  font-weight: 600;
`;

export const PayedTick = styled.Image`
  position: absolute;
  right: 3px;
  top: 13px;
  margin-right: 15px;
  width: 15px;
  height: 15px;
`;
