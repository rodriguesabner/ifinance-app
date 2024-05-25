import React, {useState} from 'react';
import {Button, Layout, Text, TextButton, Title} from "./styles";
import api from "../../../services/api";
import {TouchableOpacity, View} from "react-native";

interface AssistantProps {
    transactions: any[];
}

const Assistant = (props: AssistantProps) => {
    const [tipBot, setTipBot] = useState('');

    async function getMessageAssistant() {
        let body = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    type: "text",
                    role: "system",
                    content: "Você é um assistente financeiro e está ajudando o usuário a controlar os gastos. Leia as transações e diga o que pode ser melhorado. O que é recebido está vindo como 'income' e o que é gasto está vindo como 'outcome', pode ignorar o campo 'paid'. Também dê dicas para gastar menos baseado em como está o Brasil financeiramente. A meta é guardar 30k até o final do ano."
                },
                {
                    type: "text",
                    role: "user",
                    content: JSON.stringify(props.transactions)
                },
            ]
        };

        try {
            const {data} = await api.post('https://api.openai.com/v1/chat/completions',
                body,
                {
                    maxBodyLength: Infinity,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPEN_AI_KEY}`
                    }
                });
            setTipBot(data.choices[0].message.content);
        } catch (e) {
            console.log(JSON.stringify(e))
        }
    }

    return (
        <Layout>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Title>
                    Insights Inteligente (IA)
                </Title>
                <Button onPress={() => getMessageAssistant()}>
                    <TextButton>Gerar insight</TextButton>
                </Button>
            </View>
            <Text>{tipBot}</Text>
        </Layout>
    );
};

export default Assistant;
