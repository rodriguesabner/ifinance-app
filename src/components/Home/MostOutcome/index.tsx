import React from 'react';
import {Layout, Text} from "./styles";
import WrapperTitle from "../WrapperTitle";

interface MostOutcomeProps {
    mostOutcome: any;
    countTransactions: number;
}

const MostOutcome = (props: MostOutcomeProps) => {
    return (
        <Layout>
            <WrapperTitle
                title={''}
                subtitle={`Transações (${props.countTransactions})`}
            />

            {props.mostOutcome.length > 0 && (
                <Text>
                    Suas maiores saídas são em {
                    props.mostOutcome.map((item: any, index: number) => (
                        <Text key={index}>
                            {item.name}{index < props.mostOutcome.length - 1 ? ', ' : ''}
                        </Text>
                    ))}
                </Text>
            )}
        </Layout>
    );
};

export default MostOutcome;
