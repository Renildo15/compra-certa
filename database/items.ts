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

    async function getItems(listId: string): Promise<DatabaseSchema['itens'][]> {
        try {
            const query = `
                SELECT * FROM itens
                WHERE listId = ?
                ORDER BY created_at DESC;
            `;
            const response = await database.getAllAsync<DatabaseSchema['itens']>(query, [listId]);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function getItem(itemId: string): Promise<DatabaseSchema['itens'] | null> {
        try {
            const query = `
                SELECT * FROM itens
                WHERE id = ?
                LIMIT 1;
            `;
            const response = await database.getFirstAsync<DatabaseSchema['itens']>(query, [itemId]);
            return response || null;
        } catch (error) {
            throw error;
        }
    }

    async function updateItemChecked(itemId: string, checked: boolean) {
        const statement = await database.prepareAsync(
            "UPDATE itens SET purchased = $purchased WHERE id = $id;"
        );
        try {
            await statement.executeAsync({
                $id: itemId,
                $purchased: checked ? 1 : 0, // Assuming purchased is a boolean stored as an integer
            });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function updateItemPrice(itemId: string, newPrice: number) {
        const statement = await database.prepareAsync(
            "UPDATE itens SET price = $price WHERE id = $id;"
        );

        try {
            await statement.executeAsync({
                $id: itemId,
                $price: newPrice,
            })
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function deleteItem(itemId: string) {
        const statement = await database.prepareAsync(
            "DELETE FROM itens WHERE id = $id;"
        );

        try {
            await statement.executeAsync({
                $id: itemId,
            });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function updateItem(itemId: string, data: Partial<DatabaseSchema['itens']>) {
        const fields = Object.keys(data).map(key => `${key} = $${key}`).join(', ');
        const statement = await database.prepareAsync(
            `UPDATE itens SET ${fields} WHERE id = $id;`
        );

        try {
            await statement.executeAsync({
                ...data,
                $id: itemId,
            });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }
    return {
        create,
        getItems,
        updateItemChecked,
        updateItemPrice,
        getItem,
        deleteItem,
        updateItem,
    }
}