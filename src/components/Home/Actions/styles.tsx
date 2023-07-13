import styled from "styled-components/native";

export const Layout = styled.View`
  margin-top: -20px;
  margin-bottom: 20px;
`;

export const WrapperActions = styled.FlatList.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
})`
  
`;

export const ActionItem = styled.TouchableOpacity`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #333333;
  border-radius: 500px;
  width: 100px;
  height: 100px;
  margin-right: 15px;
`;

export const ActionIcon = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

export const ActionText = styled.Text`
  color: #777;  
  max-width: 60px;
  text-align: center;
`;
