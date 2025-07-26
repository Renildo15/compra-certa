import { useState } from "react";
import { View } from "../Themed";
import { StyleSheet } from "react-native";
import CardItem from "../CardItem";
import { Item } from "@/types/items";
import ItemHeader from "../ItemHeader";
import AddItemForm from "../AddItem";

interface ItemsListProps {
    listType: "mercado" | "pedido";
}

export default function ItemsList({ listType = "mercado" }: ItemsListProps) {
    const mockItems: Item[] = [
        { id: '1', name: 'Arroz', quantity: '1kg', price: 8.50, purchased: false, listId: '1', created_at: new Date().toISOString(), category: 'Grains', observation: '' },
        { id: '2', name: 'Feijão', quantity: '1kg', price: 9.20, purchased: true, listId: '1', created_at: new Date().toISOString(), category: 'Grains', observation: '' },
        { id: '3', name: 'Óleo', quantity: '900ml', price: 7.80, purchased: false, listId: '1', created_at: new Date().toISOString(), category: 'Grains', observation: '' },
    ];

    const [items, setItems] = useState<Item[]>(mockItems);

    const toggleItemChecked = (itemId: string) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === itemId ? { ...item, purchased: !item.purchased } : item
            )
        );
    };

    const handleAddItem = () => {
        // router.push(`/(list)/${listId}/new-item`);
    };

    return (
        <View style={styles.itemsContainer}>
            <ItemHeader handleAddItem={handleAddItem} />
            {items.map(item => (
                <CardItem 
                    key={item.id} 
                    item={item} 
                    toggleItemChecked={toggleItemChecked} 
                />
            ))}

            <AddItemForm listType={listType}/>
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