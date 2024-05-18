import React, {useState} from 'react';
import {Container, Item, Layout} from "./styles";
import {Bank, DotsThree, Receipt, Wallet, X} from "phosphor-react-native";
import {Text} from "react-native";
import {useNavigation} from "@react-navigation/native";

const BottomNavigation = () => {
    const navigation = useNavigation();

    return (
        <Layout>
            <Container>
                <Item>
                    <Wallet size={18} color={"#fff"}/>
                    <Text style={{color: '#fff'}}>Início</Text>
                </Item>
                <Item>
                    <Receipt size={18} color={"#fff"}/>
                    <Text style={{color: '#fff'}}>Extrato</Text>
                </Item>
                <Item onPress={() => navigation.navigate("ChooseActionAdd")}>
                    <Bank size={18} color={"#fff"}/>
                    <Text style={{color: '#fff'}}>Adicionar</Text>
                </Item>
                <Item>
                    <DotsThree size={18} color={"#fff"}/>
                    <Text style={{color: '#fff'}}>Mais</Text>
                </Item>
            </Container>
        </Layout>
    );
};

export default BottomNavigation;
