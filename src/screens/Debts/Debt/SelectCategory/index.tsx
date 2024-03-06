import React from 'react';
import {CurrentCategory, TextCurrentCategory} from "../styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {Platform, View} from "react-native";
import {Picker} from "@react-native-picker/picker";

interface OutcomeSelectProps {
    category: string
    setCategory: (value: React.SetStateAction<string>) => void
    showCategoryPicker: boolean
    setShowCategoryPicker: (value: React.SetStateAction<boolean>) => void
    type: string
}

const OutcomeSelect = (props: OutcomeSelectProps) => {
    const $balance = useSelector((state: RootState) => state.balance);
    const category = props.type === 'income' ? $balance.categoriesIncome : $balance.categories

    return (
        <View>
            {Platform.OS === 'ios' ? (
                <View>
                    <CurrentCategory onPress={() => props.setShowCategoryPicker(!props.showCategoryPicker)}>
                        <TextCurrentCategory color={props.category === '' ? '#999' : '#000'}>
                            {props.category === '' ? 'Escolher uma categoria' : props.category}
                        </TextCurrentCategory>
                    </CurrentCategory>
                    {props.showCategoryPicker && (
                        <Picker
                            selectedValue={props.category}
                            onValueChange={(itemValue, itemIndex) => {
                                props.setCategory(itemValue)
                                props.setShowCategoryPicker(false)
                            }}
                        >
                            {category.map((item, index) => (
                                <Picker.Item key={index} label={item.title} value={item.title} color={'#000'}/>
                            ))}
                        </Picker>
                    )}
                </View>
            ) : (
                <Picker
                    style={{backgroundColor: '#fafafa', borderRadius: 4}}
                    prompt={'Selecione uma categoria'}
                    selectedValue={props.category}
                    onValueChange={(itemValue, itemIndex) => {
                        props.setCategory(itemValue)
                        props.setShowCategoryPicker(false)
                    }}
                >
                    {$balance.categories.map((item, index) => (
                        <Picker.Item key={index} label={item.title} value={item.title} color={'#000'}/>
                    ))}
                </Picker>
            )}
        </View>
    );
};

export default OutcomeSelect;
