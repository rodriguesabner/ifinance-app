import styled from "styled-components/native";

export const Layout = styled.View`
  background-color: #fff;
  flex: 1;
  padding: 24px 36px;
`;

export const Title = styled.Text`
  font-size: 36px;
  font-weight: 500;
`;

export const Category = styled.Text`
  font-size: 18px;
  opacity: .3;
  text-transform: lowercase;
`;

export const Price = styled.Text`
  font-size: 30px;
  font-weight: 600;
`;

export const Label = styled.Text`
  opacity: .4;
  font-size: 16px;
  margin-bottom: 10px;  
`;

export const WrapperInput = styled.View`
  margin-top: 20px;
`;

export const WrapperPaidTransaction = styled.View`
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  flex-direction: row;
  padding: 10px 30px;
  border-radius: 20px;
  margin: 20px auto 0;
`;

export const WrapperDetail = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, .1);
  padding: 10px;
  flex-direction: row;
  align-items: center;
  padding-bottom: 20px;
`;
