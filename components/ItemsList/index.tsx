import { Text, View } from "../Themed";
import { FlatList, StyleSheet } from "react-native";
import CardItem from "../CardItem";
import { Item } from "@/types/items";
import ItemHeader from "../ItemHeader";
import AddItemForm from "../AddItem";
import { useItemDatabase } from "@/database/items";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BudgetExpenseType, ListWithBudget } from "@/types";
import { useListDatabase } from "@/database/lists";
import { useBudget } from "@/hooks/useBudget";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import UpdatePriceItem from "../UpdatePriceItem";

interface ItemsListProps {
   listData: ListWithBudget | undefined;
}

export default function ItemsList({ listData }: ItemsListProps) {
    const [visible, setVisible] = useState(false);

    const itemDatabase = useItemDatabase();
    const listDatabase = useListDatabase();
    const queryClient = useQueryClient();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const { data: itemData, isLoading: isItemLoading } = useQuery({
        queryKey: ['itemsList', listData?.id, 'items'],
        queryFn: () => itemDatabase.getItems(listData?.id as string),
        enabled: !!listData?.id,
    });

    const saveData = async (newItem: BudgetExpenseType) => {
        try {
            const storedData = await AsyncStorage.getItem("lists_expense");
            const existingList: BudgetExpenseType[] = storedData ? JSON.parse(storedData) : [];

            const itemExists = existingList.some((item: BudgetExpenseType) => 
                item.item_name === newItem.item_name
            );

            if (!itemExists) {
                const updatedList = [...existingList, newItem];
                await AsyncStorage.setItem('lists_expense', JSON.stringify(updatedList));
                setBudgetsExpense(updatedList);
            }
        } catch (error) {
            console.error("Erro ao salvar!", error)            
        }
    }

    const removeItem = async (itemID: string) => {
        try {
            const storedData = await AsyncStorage.getItem("lists_expense");
            const existingList: BudgetExpenseType[] = storedData ? JSON.parse(storedData) : [];
    
            const list = existingList.filter((item) => item.item_id !== itemID)
            const updatedList = [...list];
            await AsyncStorage.setItem('lists_expense', JSON.stringify(updatedList));
            setBudgetsExpense(updatedList);
        } catch (error) {
            console.error("Erro ao remover item!", error) 
        }
    }
    const storeExpanseValue = async (value: number) => {
        try {
            await AsyncStorage.setItem(`expenseValue`, value.toString());
        } catch (error) {
            console.error("Error storing expense value:", error);
        }
    }

    const retrieveExpenseValue = async () => {
        try {
            const value = await AsyncStorage.getItem(`expenseValue`);
            return value ? parseFloat(value) : 0;
        } catch (error) {
            console.error("Error retrieving expense value:", error);
            return 0;
        }
    }

    const {setExpenseValue, expenseValue, setBudgetsExpense} = useBudget();

    const clearAppData = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            await AsyncStorage.multiRemove(keys);
        } catch (error) {
            console.error('Error clearing app data:', error);
        }
    };      

    useEffect(() => {
        const fetchAndSetExpenseValue = async () => {
            const storedValue = await retrieveExpenseValue();
            setExpenseValue(storedValue);

        };

        fetchAndSetExpenseValue();       
        // clearAppData()
    },[])
    
    const toggleItemChecked = async (itemId: string) => {
        try {
            const item = itemData?.find(item => item.id === itemId);
            if (!item) return;

            // Obter o valor MAIS RECENTE do orçamento diretamente do banco
            const currentListData = await listDatabase.getList(listData?.id as string);
            const currentBudgetValue = currentListData?.budget?.value ?? 0;
            
            const price = Number(item.price) || 0;

            if (price === 0) {
                setVisible(true);
                setSelectedItemId(itemId);
                return;
            }

            setSelectedItemId(null);

            const quantity = Number(item.quantity) || 1;
            const itemTotalValue = price * quantity;

            // Atualizar os valores de despesas e restante
            if (!listData?.id) return
            let newItem:BudgetExpenseType = {
                list_id: listData?.id,
                item_id: item.id,
                item_name: item.name,
                list_expense_value: itemTotalValue
            }
            if (!item.purchased) {
                setExpenseValue(expenseValue + itemTotalValue);
                await storeExpanseValue(expenseValue + itemTotalValue);
            } else {
                setExpenseValue(expenseValue - itemTotalValue);
                await storeExpanseValue(expenseValue - itemTotalValue);
                removeItem(item.id)
            }

            await saveData(newItem)
            // Determinar a nova operação baseada no estado ATUAL do item
            const newPurchasedStatus = !item.purchased;
            const budgetAdjustment = newPurchasedStatus ? -itemTotalValue : itemTotalValue;
            const newBudgetValue = currentBudgetValue + budgetAdjustment;

            // Executar todas as atualizações de forma atômica
            await Promise.all([
                itemDatabase.updateItemChecked(itemId, newPurchasedStatus),
                listDatabase.updateListBudget(
                    currentListData?.budget?.id as string, 
                    listData?.id as string, 
                    newBudgetValue,
                    currentListData?.budget?.value_original || 0
                ),
            ]);

            // Atualizar as queries
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['itemsList', listData?.id, 'items'] }),
                queryClient.invalidateQueries({ queryKey: ['listdetails', listData?.id] }),
                queryClient.invalidateQueries({ queryKey: ['lists']})
            ]);
            
        } catch (error) {
            console.error("Error toggling item checked status:", error);
        }
    };

    return (
        <View style={styles.itemsContainer}>
            <ItemHeader/>
            <FlatList
                data={itemData}
                keyExtractor={(item: Item) => item.id}
                renderItem={({ item }) => (
                    <CardItem 
                        key={item.id} 
                        item={item} 
                        toggleItemChecked={toggleItemChecked} 
                    />
                )}
                ListEmptyComponent={
                    <View style={{ padding: 20 }}>
                        <Text style={{ textAlign: 'center', color: '#888' }}>
                            Nenhum item encontrado. Adicione um novo item.
                        </Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshing={isItemLoading}
                onRefresh={async () => {
                    await queryClient.invalidateQueries({ 
                        queryKey: ['itemsList', listData?.id, 'items'] // Use a mesma queryKey da sua query
                    });

                }}
            />

            <AddItemForm 
                listType={listData?.type ?? 'mercado'} 
                listId={listData?.id ?? ''}
                onItemAdded={async () => {
                    await queryClient.invalidateQueries({ queryKey: ['itemsList', listData?.id, 'items'] });
                }}
            />
            <UpdatePriceItem
                itemId={selectedItemId ?? ''}
                visible={visible}
                setVisible={setVisible}
                onItemUpdated={async () => {
                    await queryClient.invalidateQueries({ queryKey: ['itemsList', listData?.id, 'items'] });
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    itemsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});