import React from 'react';
import {AppTitle, ControlTitle, Layout} from "./styles";

interface WrapperTitleProps {
    title: string;
    subtitle?: string;
}

const WrapperTitle = (props: WrapperTitleProps) => {
    return (
        <Layout>
            <AppTitle>{props.title}</AppTitle>
            <ControlTitle>{props.subtitle}</ControlTitle>
        </Layout>
    );
};

export default WrapperTitle;
