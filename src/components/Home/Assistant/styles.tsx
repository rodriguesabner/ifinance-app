import styled from "styled-components/native";

export const Layout = styled.View.attrs({
    marginVertical: 10,
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
    flexDirection: 'column'
})`
    
`;

export const Title = styled.Text`
    color: #4b4b4b;
    max-width: 350px;
    margin-top: 5px;
    font-weight: 500;
    font-size: 16px;
`;

export const Button = styled.TouchableOpacity`
    background-color: #5480d2;
    padding: 10px;
    border-radius: 20px;
`;

export const TextButton = styled.Text`
    color: #fff;
    max-width: 350px;
    font-weight: 500;
    font-size: 12px;
`;


export const Text = styled.Text`
    color: #888;
    max-width: 350px;
    margin-top: 5px;
    font-weight: 500;
    font-size: 16px;
`;
