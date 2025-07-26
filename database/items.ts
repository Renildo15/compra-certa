import { useSQLiteContext } from "expo-sqlite";
import { DatabaseSchema, ListWithBudget } from "@/types";

export function useItemDatabase() {
    const database = useSQLiteContext();
    
    async function create(data: DatabaseSchema['itens']) {
        const statement = await database.prepareAsync(
            "INSERT INTO itens (id, name, quantity, price, listId, created_at) VALUES ($id, $name, $quantity, $price, $listId, $created_at);"
        );

        try {
            const result = await statement.executeAsync({
                $id: data.id || String(new Date().getTime()), // Generate a unique ID if not provided
                $name: data.name || '',
                $quantity: data.quantity || 1,
                $price: data.price || 0,
                $listId: data.listId || '',
                $created_at: new Date().toISOString(),
            });

            const insertedRowId = result.lastInsertRowId.toLocaleString();
            return {
                ...data,
                id: insertedRowId,
                created_at: new Date().toISOString(),
            };
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return {
        create,
    }
}