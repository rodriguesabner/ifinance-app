import styled from "styled-components/native";

export const Layout = styled.View.attrs({
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
})`
    position: absolute;
    bottom: 20px;
    width: 90%;
    height: 70px;
    background-color: #fff;
    border-radius: 30px;
    margin-left: 18px;
`;

export const Container = styled.View`
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 30px;
    flex-direction: row;
`;

export const Item = styled.TouchableOpacity`
    align-items: center;
    gap: 5px;
`;
