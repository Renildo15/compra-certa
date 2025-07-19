import { DatabaseSchema } from "@/types";
import { useSQLiteContext } from "expo-sqlite";

export function useBudgetDatabase() {
    const database = useSQLiteContext();

    async function create (data: DatabaseSchema['budgets']) {
        const statement = await database.prepareAsync(
            "INSERT INTO budgets (id, listId, value) VALUES ($id, $listId, $value);"
        )

        try {
            const result = await statement.executeAsync({
                $id: data.id || String(new Date().getTime()), // Generate a unique ID if not provided
                $listId: data.listId,
                $value: data.value,
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString();
            return {
                ...data,
                id: insertedRowId,
            };
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return {
        create
    }
}