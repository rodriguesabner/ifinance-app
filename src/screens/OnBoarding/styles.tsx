import styled from "styled-components/native";
import { BlurView } from 'expo-blur';

export const Layout = styled.View`
  flex: 1;
  background-color: #b6bbe9;
  justify-content: center;
  align-items: center;
`;

export const Image = styled.Image.attrs({
    resizeMode: 'contain'
})`
  width: 80%;
`;

export const MainContainer = styled.View`
  padding: 26px;
`;

export const Title = styled.Text`
  font-size: 36px;
  color: #000;
  font-weight: 600;
  margin-bottom: 15px;
  max-width: 300px;
  text-align: center;
`;

export const SubTitle = styled.Text`
  font-size: 18px;
  color: #000;
  font-weight: 400;
  max-width: 300px;
  opacity: .7;
  text-align: center;
`;

export const BottomContainer = styled(BlurView).attrs({
    intensity: 90,
    tint: 'light',
})`
  position: absolute;
  width: 100%;
  height: 120px;
  bottom: 0;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  z-index: 10;
  justify-content: center;
  padding: 0 36px;
`;

export const WrapperButton = styled.TouchableOpacity`
  background-color: #000;
  padding: 20px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
`;
