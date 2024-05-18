import {View} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import "expo-dev-client"
import {Suspense} from "react";
import {Routes} from "./src/routes";
import {Provider} from "react-redux";
import store from "./src/store";
import {Layout} from "./src/styles";
import {migrateDbIfNeeded} from "./src/database/config.database";
import {SQLiteProvider} from "expo-sqlite";

export default function App() {
    return (
        <Suspense fallback={<View/>}>
            <SQLiteProvider databaseName="transactions.db" onInit={migrateDbIfNeeded}>
                <RootSiblingParent>
                    <Provider store={store}>
                        <Layout>
                            <Routes/>
                        </Layout>
                    </Provider>
                </RootSiblingParent>
            </SQLiteProvider>
        </Suspense>
    );
}
