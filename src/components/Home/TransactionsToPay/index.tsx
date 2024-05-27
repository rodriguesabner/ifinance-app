import React from 'react';
import {Check, Warning} from "phosphor-react-native";
import {Text, View} from "react-native";
import {convertToPrice} from "../../../store/reducers/balance";
import {TransactionProps} from "../../../interfaces/transaction.interface";

const TransactionsToPay = ({transactionsToPay}: {transactionsToPay: TransactionProps[]}) => {
    return (
        <View
            style={{
                marginVertical: 10,
                display: "flex",
                position: "relative",
                backgroundColor: "#fff",
                shadowColor: "#d5d5d5",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 3,
                padding: 20,
                borderRadius: 10,
                gap: 10,
                flexDirection: 'row'
            }}>
            {transactionsToPay.length > 0 ? (
                <Warning
                    size={40}
                    color={'#e3c324'}
                />
            ) : (
                <Check
                    size={40}
                    color={'#3de324'}
                />
            )}
            <View>
                <Text style={{
                    fontWeight: '500',
                    fontSize: 16
                }}>
                    {transactionsToPay.length < 10 ? `0${transactionsToPay.length}` : transactionsToPay.length} despesas
                    para pagar.
                </Text>
                <Text style={{color: '#666'}}>
                    Total: R${convertToPrice(transactionsToPay.reduce((acc: number, item: { price: string; }) => {
                    return acc + parseFloat(item.price);
                }, 0))}
                </Text>
            </View>
        </View>
    );
};

export default TransactionsToPay;
