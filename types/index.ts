import { List } from "./lists";
import { Budget, BudgetExpenseType } from "./budgets";
import { Item } from "./items";

export type DatabaseSchema = {
    lists: List;
    budgets: Budget;
    itens: Item;
};

export type ListWithBudget = List & {
    budget?: Budget;
};

export {
    BudgetExpenseType
}