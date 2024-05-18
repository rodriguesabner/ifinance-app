import styled from "styled-components/native";

export const Layout = styled.View`
    flex: 1;
    background-color: #fff;
    justify-content: space-between;
    padding: 56px 30px;
`;

export const Title = styled.Text`
    font-size: 20px;
    margin-bottom: 36px;
`;

export const Container = styled.View.attrs({
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
    padding: 20,
    borderRadius: 10,
    gap: 10,
    flexDirection: 'row',
    width: '45%',
})`
    
`;
