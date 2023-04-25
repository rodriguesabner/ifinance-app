import styled from "styled-components/native";
import {Platform} from "react-native";

export const Layout = styled.View`
  position: absolute;
  bottom: 35px;
  padding: 20px 60px;

  background-color: rgba(255, 255, 255, 0.89);
  height: 65px;
  width: 180px;
  border-radius: 500px;

  left: 28%;
  right: 10%;
`;

export const Container = styled.View`
  gap: 50px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Button = styled.TouchableOpacity`
    
`;

export const Image = styled.Image.attrs({
    resizeMode: 'contain',
})`
  width: 32px;
  height: 32px;
`;
