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

    async function getListsWithBudgets(limit?:number): Promise<ListWithBudget[]> {

        try {
            const query = `
                SELECT 
                lists.*,
                budgets.id as "budget.id",
                budgets.listId as "budget.listId", 
                budgets.value as "budget.value",
                budgets.value_original as "budget.value_original"
                FROM lists
                LEFT JOIN budgets ON lists.id = budgets.listId
                ORDER BY lists.created_at DESC
                ${limit ? `LIMIT ${limit.toString()}` : ''};
            `;
            const results = await database.getAllAsync<any>(query);
  
            // Transforma o resultado plano em objeto aninhado
            return results.map(row => ({
                ...row,
                budget: row["budget.id"] ? {
                id: row["budget.id"],
                listId: row["budget.listId"],
                value: row["budget.value"],
                value_original: row["budget.value_original"]
                } : undefined
            }));
        } catch (error) {
            throw error;
        }
        
    }

    async function getList(id: string): Promise<ListWithBudget | null> {
        try {
            const query = `
                SELECT 
                    lists.*,
                    budgets.id as "budget.id",
                    budgets.listId as "budget.listId", 
                    budgets.value as "budget.value",
                    budgets.value_original as "budget.value_original"
                FROM lists
                LEFT JOIN budgets ON lists.id = budgets.listId
                WHERE lists.id = ?
                ORDER BY lists.created_at DESC
                LIMIT 1;
            `;

            const result = await database.getFirstAsync<any>(query, [id]);

            if (!result) return null;

            return {
                ...result,
                budget: result["budget.id"] ? {
                    id: result["budget.id"],
                    listId: result["budget.listId"],
                    value: result["budget.value"],
                    value_original: result["budget.value_original"]
                } : undefined
            };
        } catch (error) {
            console.error("Error fetching list:", error);
            throw error;
        }
    }

    async function updateListBudget(budgetId: string, listId: string, budgetValue: number, value_original: number) {
        try {
            const statement = await database.prepareAsync(
                `INSERT OR REPLACE INTO budgets (id, listId, value, value_original) 
                VALUES ($id, $listId, $value, $value_original);`
            );

            await statement.executeAsync({
                $id: budgetId,
                $listId: listId,
                $value: budgetValue,
                $value_original: value_original
            });

            await statement.finalizeAsync();
        } catch (error) {
            console.error("Error updating list budget:", error);
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

    async function updateMultipleLists(updates: Array<{list: DatabaseSchema['lists'], budget?: {id: string, value: number}}>) {
        try {
            await database.withTransactionAsync(async () => {
                const listStatement = await database.prepareAsync(
                    `UPDATE lists SET 
                    name = $name, 
                    type = $type, 
                    ref_month = COALESCE($ref_month, ref_month) -- mantém original se $ref_month for null
                    WHERE id = $id`
                );
                
                for (const { list } of updates) {
                    await listStatement.executeAsync({
                        $id: list.id,
                        $name: list.name,
                        $type: list.type,
                        $ref_month: list.ref_month ?? null, // bulk envia null -> COALESCE mantém o do banco
                    })
                }

                await listStatement.finalizeAsync();

                const upsertBudgetStatement = await database.prepareAsync(
                    `INSERT OR REPLACE INTO budgets 
                    (id, listId, value) 
                    VALUES (
                        COALESCE((SELECT id FROM budgets WHERE listId = $listId), $id),
                        $listId, 
                        $value
                    )`
                );

                const deleteBudgetStatement = await database.prepareAsync(
                    `DELETE FROM budgets WHERE listId = $listId`
                );

                for (const { list, budget } of updates) {
                    if (budget) {
                        await upsertBudgetStatement.executeAsync({
                            $id: budget.id,
                            $listId: list.id,
                            $value: budget.value
                        });
                    } else {
                        await deleteBudgetStatement.executeAsync({
                            $listId: list.id
                        });
                    }
                }

                await upsertBudgetStatement.finalizeAsync();
                await deleteBudgetStatement.finalizeAsync();
            });

            console.log('Lists updated successfully');
        } catch (error) {
            console.error('Database error:', error)
            throw error;
        }
    }

    return {
        create,
        getAll,
        getList,
        remove,
        update,
        getListsWithBudgets,
        removeAll,
        updateMultipleLists,
        updateListBudget
    }
}