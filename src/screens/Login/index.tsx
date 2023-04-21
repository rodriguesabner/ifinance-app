import React, {useEffect, useState} from 'react';
import {Form, Input, Layout, MainContainer, SubTitle, Title, WrapperButton} from "./styles";
import {ActivityIndicator, Alert, StatusBar, Text, View} from "react-native";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {database} from "../../config/firebase.config";
import {onValue, ref} from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnBoarding = () => {
    const navigation: NavigationProp<any> = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkIfLogged(){
            const value = await AsyncStorage.getItem('@iFinance-status')
            if(value != null){
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                })
            }

            setLoading(false);
        }

        checkIfLogged()

        return () => {
        };
    }, []);


    const goToHome = async (user: any) => {
        const userSanitized = JSON.stringify(user);
        await AsyncStorage.setItem('@iFinance-status', userSanitized)
        navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
        })
    }

    async function loginAccount() {
        if(!email || !password){
            Alert.alert('Ops!', 'Preencha todos os campos');
            return;
        }

        const userRef = ref(database, 'users');
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            const users = Object.keys(data).map((key) => {
                return {
                    id: key,
                    ...data[key],
                };
            });

            const user = users.find((user) => user.email === email);
            if (user) {
                if (user.password === password) {
                    goToHome({id: user.id, name: user.name});
                } else {
                    Alert.alert('Ops!', 'Senha incorreta');
                }
            } else {
                Alert.alert('Ops!', 'Usuário não encontrado');
            }
        });
    }

    return (
        <Layout>
            <StatusBar translucent barStyle={'light-content'}/>
            {loading
                ? <ActivityIndicator size={'large'} color={'#fff'}/>
                : (
                    <View>
                        <MainContainer>
                            <Title>Entre em sua conta</Title>
                            <SubTitle>
                                Insira seus dados para entrar em sua conta
                            </SubTitle>
                        </MainContainer>

                        <Form>
                            <Text style={{color: '#666'}}>
                                Email
                            </Text>
                            <Input placeholder={'Email'} onChangeText={(text) => setEmail(text)} value={email} textContentType={'emailAddress'} keyboardType={'email-address'} />

                            <Text style={{color: '#666'}}>
                                Senha
                            </Text>
                            <Input placeholder={'Senha'} onChangeText={(text) => setPassword(text)} value={password} textContentType={'password'} secureTextEntry={true}/>
                        </Form>

                        <WrapperButton onPress={() => loginAccount()}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>Entrar</Text>
                        </WrapperButton>
                    </View>
                )
            }
        </Layout>
    );
};

export default OnBoarding;