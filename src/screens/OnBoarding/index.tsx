import React from 'react';
import {BottomContainer, Image, Layout, MainContainer, SubTitle, Title, WrapperButton} from "./styles";
import {StatusBar, Text} from "react-native";
import {NavigationProp, useNavigation} from "@react-navigation/native";

const OnBoarding = () => {
    const navigation: NavigationProp<any> = useNavigation();

    const goToHome = () => {
        navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
        })
    }

    return (
        <Layout>
            <StatusBar translucent barStyle={'light-content'}/>
            <Image source={require('../../assets/splash.png')}/>
            <MainContainer>
                <Title>Finanças em dia</Title>
                <SubTitle>
                    Meu aplicativo pessoal para controlar as finanças do dia a dia e programar os gastos necessários.
                </SubTitle>
            </MainContainer>
            <BottomContainer>
                <WrapperButton onPress={() => goToHome()}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>Entrar</Text>
                </WrapperButton>
            </BottomContainer>
        </Layout>
    );
};

export default OnBoarding;
