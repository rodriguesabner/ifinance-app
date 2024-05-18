import React from 'react';
import {Container, Item, Layout} from "./styles";
import {Bank, DotsThree, Receipt, Wallet, X} from "phosphor-react-native";
import {Text} from "react-native";
import ModalFull from "../Home/ModalFull";

const BottomNavigation = () => {
    const onPressedAdd = () => {
        return (
            <ModalFull>
                <X />
                <Text>
                    O que vamos adicionar?
                </Text>
                <Text>
                    Receita
                </Text>
                <Text>
                    Despesa
                </Text>
            </ModalFull>
        )
    }

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
                <Item onPress={() => onPressedAdd()}>
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
