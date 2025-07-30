import { Text, View } from "../Themed";
import { FlatList, StyleSheet } from "react-native";
import CardItem from "../CardItem";
import { Item } from "@/types/items";
import ItemHeader from "../ItemHeader";
import AddItemForm from "../AddItem";
import { useItemDatabase } from "@/database/items";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListWithBudget } from "@/types";
import { useListDatabase } from "@/database/lists";

interface ItemsListProps {
   listData: ListWithBudget | undefined;
}

export default function ItemsList({ listData }: ItemsListProps) {

    const itemDatabase = useItemDatabase();
    const listDatabase = useListDatabase();
    const queryClient = useQueryClient();
    const { data: itemData, isLoading: isItemLoading } = useQuery({
        queryKey: ['itemsList', listData?.id, 'items'],
        queryFn: () => itemDatabase.getItems(listData?.id as string),
        enabled: !!listData?.id,
    });

    const { data: listBudgetData } = useQuery({
        queryKey: ['listBudget', listData?.id],
        queryFn: () => listDatabase.getList(listData?.id as string),
        enabled: !!listData?.id,
    });



    const toggleItemChecked = async (itemId: string) => {
     
        const item = itemData?.find(item => item.id === itemId);
        if (!item) return;

        const isCurrentlyChecked = item.purchased;
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;

        const delta = (!isNaN(price) && !isNaN(quantity)) ? price * quantity : 0;

        await itemDatabase.updateItemChecked(itemId, !itemData?.find(item => item.id === itemId)?.purchased);

        const currentBudget = listBudgetData?.budget?.value ?? 0;
        const newBudgetValue = isCurrentlyChecked ? currentBudget + delta : currentBudget - delta;

        await listDatabase.updateListBudget(listBudgetData?.budget?.id as string, listData?.id as string, newBudgetValue);
        await queryClient.invalidateQueries({ 
            queryKey: ['itemsList', listData?.id, 'items'] // Use a mesma queryKey da sua query
        });
        await queryClient.invalidateQueries({ 
            queryKey: ['listBudget', listData?.id] // Invalidate the budget query
        });
    };

    const handleAddItem = () => {
        // router.push(`/(list)/${listId}/new-item`);
    };

    return (
        <View style={styles.itemsContainer}>
            <ItemHeader handleAddItem={handleAddItem} />
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