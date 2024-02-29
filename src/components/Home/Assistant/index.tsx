import React, {useEffect, useState} from 'react';
import {Layout, Text} from "./styles";
import WrapperTitle from "../WrapperTitle";
import api from "../../../services/api";

interface AssistantProps {
    transactions: any[];
}

const Assistant = (props: AssistantProps) => {
    const [tipBot, setTipBot] = useState('');

    useEffect(() => {
        async function getMessageAssistant() {
            let body = {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Você é um assistente financeiro e está ajudando o usuário a controlar os gastos. Leia as transações e diga o que pode ser melhorado. O que é recebido está vindo como 'income' e o que é gasto está vindo como 'outcome', pode ignorar o campo 'paid'. Também dê dicas para gastar menos baseado em como está o Brasil financeiramente. A meta é guardar 30k até o final do ano."
                    },
                    {
                        role: "user",
                        content: props.transactions
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
                            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPEN_AI_KEY}`
                        }
                    });
                console.log(data);
            } catch (e) {
                console.log(JSON.stringify(e))
            }
        }

        if (props.transactions.length > 0) {
            void getMessageAssistant();
        }
    }, []);

    return (
        <Layout>
            <WrapperTitle
                title={''}
                subtitle={`Assistente`}
            />

            <Text>

            </Text>
        </Layout>
    );
};

export default Assistant;
