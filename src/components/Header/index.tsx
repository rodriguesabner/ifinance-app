import React from 'react';
import {Layout} from "./styles";
import {FlatList} from "react-native";
import MenuItem from "./MenuItem";

const Header = () => {
    const menus = [
        {
            id: 2,
            name: 'Reserva',
        },
    ]

    return (
        <Layout>
            <FlatList
                data={menus}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 10}}
                renderItem={({item}) =>
                    <MenuItem name={item.name}/>
                }
            />
        </Layout>
    );
};

export default Header;
