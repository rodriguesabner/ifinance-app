import styled from "styled-components/native";
import { BlurView } from 'expo-blur';

export const Layout = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const Image = styled.Image.attrs({
    resizeMode: 'contain'
})`
  width: 80%;
`;

export const MainContainer = styled.View`
  padding: 26px;
  background-color: #152533;
  width: 100%;
  padding-top: 100px;
`;

export const Form = styled.View`
  flex-direction: column;
  padding: 24px;
  margin-top: 36px;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: rgba(0, 0, 0, .1);
  height: 42px;
  border-radius: 4px;
  padding-left: 10px;
  margin-top: 5px;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  font-size: 36px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 5px;
  max-width: 200px;
`;

export const SubTitle = styled.Text`
  font-size: 18px;
  color: #fff;
  font-weight: 400;
  max-width: 200px;
  opacity: .7;
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
  padding: 14px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: 0 20px;
`;
