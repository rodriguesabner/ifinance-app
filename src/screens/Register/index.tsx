import React, {useEffect, useRef, useState} from 'react';
import {Container, Form, Input, Layout, MainContainer, SubTitle, Title, WrapperButton} from "./styles";
import {ActivityIndicator, Alert, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {off, onValue, ref, update} from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

        const userRef = ref(database, 'users');
        const allUsers: any[] = [];
        onValue(userRef, async (snapshot) => {
            const data = snapshot.val();
            const users = Object.keys(data).map((key) => {
                return {
                    id: key,
                    ...data[key],
                };
            });

            const user = users.find((user) => user.email === email);
            allUsers.push(user);
        });

        off(userRef)

        const currentUser = allUsers.find((user) => user.email === email)
        if (currentUser) {
            Alert.alert('Ops!', 'Este email já está cadastrado');
            setLoading(false);
        } else {
            const id = Date.now();
            const db = ref(database, 'users/' + id);

            const newUser = {
                id,
                name,
                email,
                password
            }

            await update(db, newUser);
            await goToHome({id, name});
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
                                    onChangeText={(text) => setName(text)}
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
                                    onSubmitEditing={() => register()}
                                />
                            </Form>

                            <WrapperButton onPress={() => register()}>
                                {loading && (<ActivityIndicator size={'small'} color={'#fff'}/>)}
                                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff', marginLeft: 15}}>Criar Conta</Text>
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
