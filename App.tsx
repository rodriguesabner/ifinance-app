import {View} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import "expo-dev-client"
import {Suspense, useEffect} from "react";
import {Routes} from "./src/routes";
import {Provider} from "react-redux";
import store from "./src/store";
import {Layout} from "./src/styles";
import {setupDatabase} from "./src/database/config.database";

export default function App() {
    useEffect(() => {
        setupDatabase();
    }, []);

    return (
        <Suspense fallback={<View/>}>
            <RootSiblingParent>
                <Provider store={store}>
                    <Layout>
                        <Routes/>
                    </Layout>
                </Provider>
            </RootSiblingParent>
        </Suspense>
    );
}
