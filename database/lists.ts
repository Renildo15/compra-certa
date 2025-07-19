import { useSQLiteContext } from "expo-sqlite";
import { DatabaseSchema, ListWithBudget } from "@/types";


export function useListDatabase() {
    const database = useSQLiteContext();

    async function create (data: DatabaseSchema['lists']) {
        const statement = await database.prepareAsync(
            "INSERT INTO lists (id, name, type, ref_month, created_at) VALUES ($id, $name, $type, $ref_month, $created_at);"
        )

        try {
            const result = await statement.executeAsync({
                $id: data.id || String(new Date().getTime()), // Generate a unique ID if not provided
                $name: data.name || '',
                $type: data.type || 'mercado',
                $ref_month: data.ref_month || null,
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

    async function getAll (): Promise<DatabaseSchema['lists'][]> {
        try {
            const query = "SELECT * FROM lists ORDER BY created_at DESC;";

            const response = await database.getAllAsync<DatabaseSchema['lists']>(query);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function getListsWithBudgets(): Promise<ListWithBudget[]> {

        try {
            const query = `
                SELECT 
                lists.*,
                budgets.id as "budget.id",
                budgets.listId as "budget.listId", 
                budgets.value as "budget.value"
                FROM lists
                LEFT JOIN budgets ON lists.id = budgets.listId
                ORDER BY lists.created_at DESC;
            `;

            const results = await database.getAllAsync<any>(query);
  
            // Transforma o resultado plano em objeto aninhado
            return results.map(row => ({
                ...row,
                budget: row["budget.id"] ? {
                id: row["budget.id"],
                listId: row["budget.listId"],
                value: row["budget.value"]
                } : undefined
            }));
        } catch (error) {
            throw error;
        }
        
    }

    async function getList (id:string): Promise<DatabaseSchema['lists'] | null> {
        try {
            const query = "SELECT * FROM lists WHERE id = ?;";
            const response = await database.getFirstAsync<DatabaseSchema['lists']>(query, [id]);
            return response || null;
        } catch (error) {
            throw error;
        }
    }

    async function remove(id: string) {
        try {
            await database.execAsync("DELETE FROM lists WHERE id = " + id)
        } catch (error) {
            throw error
        }
    }

    async function removeAll(ids: string[]) {
        try {
            if (ids.length === 0) return;
            const placeholders = ids.map(() => '?').join(',');
            await database.runAsync(`DELETE FROM lists WHERE id IN (${placeholders})`, ids);

            await database.runAsync(`DELETE FROM budgets WHERE listId IN (${placeholders})`, ids);
        } catch (error) {
            throw error;
        }
    }

     async function update(data: DatabaseSchema['lists']) {
        const statement = await database.prepareAsync(
        "UPDATE lists SET name = $name, type = $type, ref_month = $ref_month WHERE id = $id;"
        )

        try {
        await statement.executeAsync({
            $id: data.id,
            $name: data.name,
            $type: data.type,
            $ref_month: data.ref_month || null,
            $created_at: data.created_at || new Date().toISOString(),
        })
        } catch (error) {
        throw error
        } finally {
        await statement.finalizeAsync()
        }
    }

    return {
        create,
        getAll,
        getList,
        remove,
        update,
        getListsWithBudgets,
        removeAll
    }
}