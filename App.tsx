import {View} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import "expo-dev-client"
import {Suspense} from "react";
import {Routes} from "./src/routes";
import {Provider} from "react-redux";
import store from "./src/store";
import {Layout} from "./src/styles";

export default function App() {
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
