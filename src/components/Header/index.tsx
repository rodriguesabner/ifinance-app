import React from 'react';
import {Layout} from "./styles";
import {FlatList} from "react-native";
import MenuItem from "./MenuItem";

const Header = () => {
    const menus = [
        {
            id: 1,
            name: 'Reserva',
            hidden: false
        },
        {
            id: 2,
            name: 'Gerar Planilha',
            hidden: false
        },
    ]

    return (
        <Layout>
            <FlatList
                data={menus}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 10}}
                renderItem={({item}) => {
                    if (item.hidden) {
                        return null;
                    }

                    return <MenuItem name={item.name}/>
                }}
            />
        </Layout>
    );
};

export default Header;
