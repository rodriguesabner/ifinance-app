import React, {useEffect, useRef, useState} from 'react';
import {Container, Form, Input, Layout, MainContainer, SubTitle, Title, WrapperButton} from "./styles";
import {ActivityIndicator, Alert, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {onValue, ref} from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    const navigation: NavigationProp<any> = useNavigation();
    const passwordInputRef = useRef(null)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function checkIfLogged() {
            const value = await AsyncStorage.getItem('@iFinance-status')
            if (value != null) {
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                })
            }
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
        if (!email || !password) {
            Alert.alert('Ops!', 'Preencha todos os campos');
            return;
        }

        const userRef = ref(database, 'users');
        onValue(userRef, async (snapshot) => {
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
                    await goToHome({id: user.id, name: user.name});
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
            <Container>
                <StatusBar translucent barStyle={'dark-content'}/>
                <View>
                    <MainContainer>
                        <Title>Bem vindo de volta</Title>
                        <SubTitle>
                            Estamos feliz em vê-lo novamente, para entrar em sua conta insira seus dados abaixo.
                        </SubTitle>
                    </MainContainer>

                    <Form>
                        <Input
                            placeholder={'jhon@gmail.com'}
                            onChangeText={(text) => setEmail(text)}
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
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            textContentType={'password'}
                            secureTextEntry={true}
                            returnKeyLabel={'join'}
                            returnKeyType={'join'}
                            onSubmitEditing={() => loginAccount()}
                        />
                    </Form>

                    <WrapperButton onPress={() => loginAccount()}>
                        {loading && (<ActivityIndicator size={'small'} color={'#fff'}/>)}
                        <Text style={{marginLeft: 15, fontSize: 18, fontWeight: 'bold', color: '#fff'}}>Entrar</Text>
                    </WrapperButton>

                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20
                        }}
                    >
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={{color: 'blue'}}>
                                Ainda não tem uma conta? Cadastre-se aqui
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        </Layout>
    );
};

export default Login;
