import styled from "styled-components/native";

interface LayoutProps {
    backgroundColor?: string;
}
export const Layout = styled.TouchableOpacity.attrs({
    activeOpacity: .8
})<LayoutProps>`
    border-bottom-width: 1px;
    border-bottom-color: rgba(0, 0, 0, .1);
    padding: 20px;
    flex-direction: row;
    justify-content: space-between;
    border-radius: 20px;
    align-items: center;
    background-color: #fff;
    margin-bottom: 5px;
`;

export const LeftWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TypeTransaction = styled.Text`
  font-size: 12px;  
  color: #999;
`;

export const Container = styled.View`
  margin-left: 16px;
  gap: 5px;
`;

export const TitleTransaction = styled.Text`
  font-weight: 600;
  font-size: 16px;
  max-width: 200px;
  color: #000;
`;

export const Category = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #777;
`;

type PayedTickProps = {
    backgroundColor?: string;
}

export const PayedTick = styled.View`
  padding: 15px;
  border-radius: 500px;
  background-color: ${(props: PayedTickProps) => props.backgroundColor || 'rgba(164,164,164,0.16)'};
  border-width: 1px;
  border-color: rgba(255, 255, 255, .3);
`;

export const DateTransactions = styled.Text`
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #999;
`;
