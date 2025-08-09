export type Budget = {
    id: string;
    listId: string;
    value: number;
    value_original: number;
}

export type BudgetExpenseType = {
    list_id: string;
    list_expense_value: string | number;
}
