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
                    props.mostOutcome.length === 2
                        ? `${props.mostOutcome[0].name} e ${props.mostOutcome[1].name}`
                        : props.mostOutcome
                            .map((item: any, index: number, array: any[]) =>
                                `${item.name}${index < array.length - 2 ? ', ' : index === array.length - 2 ? ' e ' : ''}`)
                            .join('')
                }
                </Text>
            )}
        </Layout>
    );
};

export default MostOutcome;
