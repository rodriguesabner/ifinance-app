import React from 'react';
import {View} from "react-native";
import {Button, Header, Layout} from "./styles";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {X} from "phosphor-react-native";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentDate} from "../../store/reducers/balance";
import {RootState} from "../../store/reducers";

const DateChooser = () => {
    const dispatch = useDispatch();
    const navigation: NavigationProp<any> = useNavigation();
    const $balance = useSelector((state: RootState) => state.balance);

    const handleBackNavigation = () => {
        navigation.goBack();
    }

    return (
        <Layout>
            <Header>
                <View/>

                <Button onPress={() => handleBackNavigation()}>
                    <X size={18}/>
                </Button>
            </Header>
            <RNDateTimePicker
                style={{marginTop: 10}}
                mode={'date'}
                value={new Date($balance.currentDate)}
                display={'spinner'}
                locale={'pt-BR'}
                onChange={(event, selectedDate) => {
                    const currentDate = selectedDate?.toISOString() || $balance.currentDate;
                    dispatch(setCurrentDate(currentDate));
                    handleBackNavigation();
                }}
            />
        </Layout>
    );
};

export default DateChooser;
