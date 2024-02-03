interface TransactionProps {
    id?: string | number;
    price: string;
    name: string;
    category: string;
    date: Date;
    type: string;
    description: string;
    paid: boolean;
}

export type {
    TransactionProps
}
