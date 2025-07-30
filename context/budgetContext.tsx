import React from "react";

type BudgetContextType = {
    expenseValue: number;
    setExpenseValue: (value: number) => void;
    restValue: number;
    setRestValue: (value: number) => void;
};


export const BudgetContext = React.createContext<BudgetContextType | undefined>(
    {
        expenseValue: 0,
        setExpenseValue: () => {},
        restValue: 0,
        setRestValue: () => {},
    }
);


export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
    const [expenseValue, setExpenseValue] = React.useState(0);
    const [restValue, setRestValue] = React.useState(0);

    return (
        <BudgetContext.Provider
            value={{
                expenseValue,
                setExpenseValue,
                restValue,
                setRestValue,
            }}
        >
            {children}
        </BudgetContext.Provider>
    );
}