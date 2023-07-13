import styled from "styled-components/native";

export const Layout = styled.View`
  background-color: #222222;
  flex: 1;
  padding: 24px 36px;
`;

export const Title = styled.Text`
  font-size: 36px;
  font-weight: 500;
  color: #fff;
`;

export const Category = styled.Text`
  font-size: 18px;
  opacity: .3;
  text-transform: lowercase;
  color: #fff;
`;

export const Price = styled.Text`
  font-size: 30px;
  font-weight: 600;
  color: #fff;
`;

export const Label = styled.Text`
  opacity: .4;
  font-size: 16px;
`;

export const DateText = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

export const WrapperView = styled.View`
    margin: 10px 0;
`;

export const WrapperPaidTransaction = styled.View`
  background-color: #3e3e3e;
  flex-direction: row;
  padding: 10px 30px;
  border-radius: 20px;
  margin: 20px 0;
  max-width: 250px;
  align-items: center;
  margin-bottom: -16px;
`;

export const WrapperDetail = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, .1);
  padding: 10px;
  flex-direction: row;
  align-items: center;
  padding-bottom: 20px;
`;
