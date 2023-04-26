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
  background-color: #fff;
  width: 100%;
  padding-top: 100px;
`;

export const Form = styled.View`
  flex-direction: column;
  padding: 24px;
`;

export const Input = styled.TextInput.attrs({
    placeholderTextColor: '#666',
})`
  height: 48px;
  border-radius: 15px;
  padding-left: 15px;
  margin-top: 5px;
  background-color: #eaedf5;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  font-size: 30px;
  color: #3561fc;
  font-weight: 600;
  margin-bottom: 5px;
  max-width: 250px;
`;

export const SubTitle = styled.Text`
  font-size: 18px;
  color: #666;
  font-weight: 400;
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
  background-color: #3561fc;
  padding: 14px;
  border-radius: 15px;
  height: 59px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: 0 20px;
`;
