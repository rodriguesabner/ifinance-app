import styled from "styled-components/native";
import {Dimensions, Platform} from "react-native";

const screenWidth = Math.round(Dimensions.get('window').width);

export const Layout = styled.View`
  position: absolute;
  bottom: 35px;
  padding: 20px 60px;

  background-color: rgba(255, 255, 255, 0.89);
  height: 65px;
  width: 180px;
  border-radius: 500px;
  
  left: ${screenWidth / 2 - 90}px;
  right: ${screenWidth / 2 - 90}px;
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
