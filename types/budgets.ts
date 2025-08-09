export type Budget = {
    id: string;
    listId: string;
    value: number;
    value_original: number;
}

export type BudgetExpenseType = {
    list_id: string;
    item_id: string;
    item_name: string;
    list_expense_value: number;
}
