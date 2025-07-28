import { Text, View } from "../Themed";
import { FlatList, StyleSheet } from "react-native";
import CardItem from "../CardItem";
import { Item } from "@/types/items";
import ItemHeader from "../ItemHeader";
import AddItemForm from "../AddItem";
import { useItemDatabase } from "@/database/items";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListWithBudget } from "@/types";

interface ItemsListProps {
   listData: ListWithBudget | undefined;
}

export default function ItemsList({ listData }: ItemsListProps) {

    const itemDatabase = useItemDatabase();
    const queryClient = useQueryClient();
    const { data: itemData, isLoading: isItemLoading } = useQuery({
        queryKey: ['itemsList', listData?.id, 'items'],
        queryFn: () => itemDatabase.getItems(listData?.id as string),
        enabled: !!listData?.id,
    });


    const toggleItemChecked = (itemId: string) => {
        // Here you would typically update the item's checked status in the database
        // For example:
        // itemDatabase.updateItemChecked(itemId, !itemData.find(item => item.id === itemId)?.purchased);
        console.log(`Toggling item with ID: ${itemId}`);
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