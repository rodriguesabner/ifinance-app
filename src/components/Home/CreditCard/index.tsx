import {Container, Label, Layout, Price} from "./styles.ts";
import {convertToPrice} from "../../../store/reducers/balance";
import CreditCard from 'react-native-credit-card';
import {View} from "react-native";

interface CreditCardProps {
    transactions: any[];
}

const CreditCardComponent = (props: CreditCardProps) => {

    const getCreditCardTotal = () => {
        const creditCardTransactions = props.transactions.filter((t) => t.category === 'Cartão de Crédito');
        return convertToPrice(creditCardTransactions.reduce((acc, item) => {
            return acc + parseFloat(item.price);
        }, 0))
    }

    return (
        <Layout>
            <View style={{marginLeft: 15}}>
            <CreditCard
                type={'visa'}
                shiny={false}
                focused={''}
                number={'**** *** ***1667'}
                name={"Abner Rodrigues"}
                expiry={"11/29"}
                cvc={'573'}
            />
            </View>
            <Container>
                <Price>R${getCreditCardTotal()}</Price>
                <Label>Valor da fatura</Label>
            </Container>
        </Layout>
    );
};

export default CreditCardComponent;
