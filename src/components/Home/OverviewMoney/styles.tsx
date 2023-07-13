import styled from "styled-components/native";

export const Layout = styled.View`
  margin: 40px 0;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

export const Container = styled.View`
  flex-direction: column;
  background-color: #3e3e3e;
  width: 49%;
  border-radius: 20px;
  padding: 15px;
`;

export const Money = styled.Text`
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 40px;
`;

export const Type = styled.Text`
  color: #999;
  opacity: 1;
`;
