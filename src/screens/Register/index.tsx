import React, {useRef, useState} from 'react';
import {Container, Form, Input, Layout, MainContainer, SubTitle, Title, WrapperButton} from "./styles";
import {ActivityIndicator, Alert, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../../services/api";
import JWT from "expo-jwt";

const Register = () => {
    const navigation: NavigationProp<any> = useNavigation();
    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const goToHome = async (user: any) => {
        const userSanitized = JSON.stringify(user);
        await AsyncStorage.setItem('@iFinance-status', userSanitized)
        navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
        })
    }

    async function register() {
        setLoading(true);

        if (!name || !email || !password) {
            Alert.alert('Ops!', 'Preencha todos os campos');
            setLoading(false);
            return;
        }

        try {
            const {data} = await api.post("/v1/user/register", {
                email,
                password
            })

            await goToHome({token: data.token});
        } catch (e) {
            Alert.alert('Ops!', 'Este email já está cadastrado');
        }
    }

    return (
        <Layout>
            <Container>
                <StatusBar translucent barStyle={'dark-content'}/>
                {loading
                    ? <ActivityIndicator size={'large'} color={'#fff'}/>
                    : (
                        <View>
                            <MainContainer>
                                <Title>Bem vindo!</Title>
                                <SubTitle>
                                    Crie sua conta inserindo seus dados abaixo!
                                </SubTitle>
                            </MainContainer>

                            <Form>
                                <Input
                                    placeholder={'João da Silva'}
                                    onChangeText={(text: string) => setName(text)}
                                    value={name}
                                    textContentType={'name'}
                                    keyboardType={'name-phone-pad'}
                                    returnKeyLabel={'next'}
                                    returnKeyType={'next'}
                                    onSubmitEditing={() => {
                                        // @ts-ignore
                                        emailInputRef.current.focus();
                                    }}
                                />
                                <Input
                                    ref={emailInputRef}
                                    placeholder={'jhon@gmail.com'}
                                    onChangeText={(text: string) => setEmail(text)}
                                    value={email}
                                    textContentType={'emailAddress'}
                                    keyboardType={'email-address'}
                                    returnKeyLabel={'next'}
                                    returnKeyType={'next'}
                                    onSubmitEditing={() => {
                                        // @ts-ignore
                                        passwordInputRef.current.focus();
                                    }}
                                />
                                <Input
                                    ref={passwordInputRef}
                                    placeholder={'******'}
                                    onChangeText={(text: string) => setPassword(text)}
                                    value={password}
                                    textContentType={'password'}
                                    secureTextEntry={true}
                                    returnKeyLabel={'join'}
                                    returnKeyType={'join'}
                                    onSubmitEditing={() => register()}
                                />
                            </Form>

                            <WrapperButton onPress={() => register()}>
                                {loading && (<ActivityIndicator size={'small'} color={'#fff'}/>)}
                                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff', marginLeft: 15}}>Criar
                                    Conta</Text>
                            </WrapperButton>

                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 20
                                }}
                            >
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={{color: 'blue'}}>
                                        Já tem uma conta? Entre usando seus dados
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            </Container>
        </Layout>
    );
};

export default Register;
