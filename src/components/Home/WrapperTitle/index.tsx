import React from 'react';
import {AppTitle, ControlTitle, Layout} from "./styles";
import {Alert, TouchableOpacity, View} from "react-native";
import {SignOut} from "phosphor-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NavigationProp, useNavigation} from "@react-navigation/native";

interface WrapperTitleProps {
    title: string;
    subtitle?: string;
    logoutButton?: boolean;
}

const WrapperTitle = (props: WrapperTitleProps) => {
    const navigation: NavigationProp<any> = useNavigation();
    async function logout(){
        Alert.alert(
            'Sair da conta',
            'Tem certeza que deseja sair da sua conta?',
            [
                {
                    text: 'Sim, sair',
                    onPress: async () => {
                        await AsyncStorage.removeItem('@iFinance-status');

                        navigation.reset({
                            index: 0,
                            routes: [{name: 'Login'}],
                        })
                    }
                },
                {
                    text: 'Não, ficar na conta'
                }
            ])
    }

    return (
        <Layout>
            <View>
                <AppTitle>{props.title}</AppTitle>
                <ControlTitle>{props.subtitle}</ControlTitle>
            </View>

            {props?.logoutButton && (
                <TouchableOpacity onPress={() => logout()}>
                    <SignOut color={"#000"} size={24} weight={"bold"}/>
                </TouchableOpacity>
            )}
        </Layout>
    );
};

export default WrapperTitle;
