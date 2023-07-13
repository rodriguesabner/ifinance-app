import React, {useState} from 'react';
import {Keyboard, Text, View} from "react-native";
import {Button, EraseButton, Header, Layout, TextResult, TextResultBold, TotalInput, TwoColumns} from "./styles";
import WrapperTitle from "../../components/Home/WrapperTitle";
import {Currency} from "../../components/Home/CurrentBalance/styles";
import 'moment/locale/pt-br';
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {BackButton} from "../Income/styles";
import {ArrowLeft} from "phosphor-react-native";
import {convertToPrice} from "../../store/reducers/balance";

const Investments = () => {
    const navigation: NavigationProp<any> = useNavigation();

    const [totalInvestments, setTotalInvestments] = useState<any>('');
    const [finished, setFinished] = useState(false);
    const cdi = 13.65;
    const tax = 17.5;

    const calculateInvestmentsNubank = () => {
        const total = totalInvestments.replace('.', '').replace(',', '.');

        const totalWithCDI = (total * (cdi / 100));
        const totalWithTax = totalWithCDI - (totalWithCDI * (tax / 100));
        const getMonth = totalWithTax / 12;

        return convertToPrice(getMonth);
    }

    const maskMoneyBr = (value: string) => {
        const opts = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }

        const valueMask = value
            .replace(/\D/g, '')

        const ret = new Intl
            .NumberFormat('pt-BR', opts)
            .format(valueMask / 100);

        setTotalInvestments(ret);
    }

    return (
        <Layout>
            <Header>
                <View style={{alignItems: 'flex-start'}}>
                    <BackButton onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={'#fff'}/>
                    </BackButton>

                    <WrapperTitle
                        title={'Calculadora de'}
                        subtitle={'Investimentos'}
                    />
                </View>

                <View style={{
                    marginVertical: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Currency>BRL</Currency>
                    <TotalInput
                        keyboardType="numeric"
                        placeholder={'0,00'}
                        placeholderTextColor={'#ffffff'}
                        value={totalInvestments}
                        onChangeText={maskMoneyBr}
                    />
                </View>

                <TwoColumns>
                    <Button onPress={() => {
                        Keyboard.dismiss();
                        setFinished(true);
                    }}>
                        <Text>Verificar Resultados</Text>
                    </Button>

                    <EraseButton onPress={() => {
                        Keyboard.dismiss();
                        setFinished(false);
                        setTotalInvestments('0')
                    }}>
                        <Text>Limpar Resultados</Text>
                    </EraseButton>
                </TwoColumns>

                {finished && (
                    <View>
                        <WrapperTitle
                            title={'Resultado'}
                            subtitle={'_'}
                        />

                        <TextResult>
                            Estamos considerando a carteira <TextResultBold>Nubank: 100% CDI</TextResultBold> ({cdi}% ao
                            ano)
                        </TextResult>
                        <TextResult>
                            Você inseriu o valor de <TextResultBold>R${totalInvestments}</TextResultBold> para
                            investimentos.
                        </TextResult>

                        <WrapperTitle
                            title={''}
                            subtitle={'_'}
                        />

                        <TextResult style={{marginTop: 30}}>
                            Este valor renderá
                            aprox. <TextResultBold>R${calculateInvestmentsNubank()}/mês</TextResultBold> no Nubank.
                        </TextResult>
                    </View>
                )}
            </Header>
        </Layout>
    );
};

export default Investments;
