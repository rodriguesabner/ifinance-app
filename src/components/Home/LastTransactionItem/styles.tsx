import styled from "styled-components/native";

interface LayoutProps {
    backgroundColor?: string;
}
export const Layout = styled.TouchableOpacity<LayoutProps>`
  background-color: ${(props) => props.backgroundColor ?? '#e5fdf5'};
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 20px;
  align-items: center;
`;

export const LeftWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TypeTransaction = styled.Text`
  font-size: 30px;  
`;

export const Container = styled.View`
  margin-left: 16px;  
`;

export const TitleTransaction = styled.Text`
  font-weight: 600;
  font-size: 16px;
  max-width: 200px;
`;

export const Category = styled.Text`
  opacity: .3;
  font-size: 13px;
  font-weight: 600;
`;
