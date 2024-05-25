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
                    <Wallet size={18} color={"#000"}/>
                    <Text style={{color: '#000'}}>Início</Text>
                </Item>
                <Item>
                    <Receipt size={18} color={"#000"}/>
                    <Text style={{color: '#000'}}>Extrato</Text>
                </Item>
                <Item onPress={() => navigation.navigate("ChooseActionAdd")}>
                    <Bank size={18} color={"#000"}/>
                    <Text style={{color: '#000'}}>Adicionar</Text>
                </Item>
                <Item>
                    <DotsThree size={18} color={"#000"}/>
                    <Text style={{color: '#000'}}>Mais</Text>
                </Item>
            </Container>
        </Layout>
    );
};

export default BottomNavigation;
