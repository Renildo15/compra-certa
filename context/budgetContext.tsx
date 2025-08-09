import { BudgetExpenseType } from "@/types";
import React from "react";

type BudgetContextType = {
    expenseValue: number;
    setExpenseValue: (value: number) => void;
    restValue: number;
    setRestValue: (value: number) => void;
    budgetsExpense: BudgetExpenseType[],
    setBudgetsExpense: (items: BudgetExpenseType[]) => void
};

export const BudgetContext = React.createContext<BudgetContextType | undefined>(undefined);


export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
    const [expenseValue, setExpenseValue] = React.useState(0);
    const [restValue, setRestValue] = React.useState(0);
    const [budgetsExpense, setBudgetsExpense] = React.useState<BudgetExpenseType[]>([]);
    return (
        <BudgetContext.Provider
            value={{
                expenseValue,
                setExpenseValue,
                restValue,
                setRestValue,
                budgetsExpense,
                setBudgetsExpense
            }}
        >
            {children}
        </BudgetContext.Provider>
    );
}