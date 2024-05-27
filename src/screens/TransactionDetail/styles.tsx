import styled from "styled-components/native";
import {TextProps, ViewProps} from "react-native";

export const Layout = styled.View`
  background-color: #fff;
  flex: 1;
  padding: 24px 36px;
`;

export const Title = styled.Text<TextProps>`
  font-size: 36px;
  font-weight: 500;
  color: #000;
`;

export const Category = styled.Text<TextProps>`
  font-size: 18px;
  opacity: .3;
  text-transform: lowercase;
  color: #555;
`;

export const Price = styled.Text<TextProps>`
  font-size: 30px;
  font-weight: 600;
  color: #000;
`;

export const Label = styled.Text<TextProps>`
  opacity: .4;
  font-size: 16px;
`;

export const DateText = styled.Text<TextProps>`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

export const WrapperView = styled.View<ViewProps>`
    margin: 10px 0;
`;

export const WrapperPaidTransaction = styled.View<ViewProps>`
  background-color: #eee;
  flex-direction: row;
  padding: 10px 30px;
  border-radius: 20px;
  margin: 20px 0;
  max-width: 250px;
  align-items: center;
  margin-bottom: -16px;
`;

export const WrapperDetail = styled.View<ViewProps>`
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, .1);
  padding: 10px;
  flex-direction: row;
  align-items: center;
  padding-bottom: 20px;
`;
