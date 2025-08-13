import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";
import { FontAwesome } from "@expo/vector-icons";
import { Item } from "@/types/items";


interface CardItemProps {
    item: Item;
    toggleItemChecked: (id: string) => void;
    listType: "mercado" | "pedido"
}

export default function CardItem({ item, toggleItemChecked, listType }: CardItemProps) {
    return (
        <View key={item.id} style={[styles.item, item.purchased && styles.checkedItem]}>
            { listType === "mercado" && 
                <TouchableOpacity 
                    onPress={() => toggleItemChecked(item.id)}
                    style={styles.checkbox}
                >
                    <FontAwesome 
                        name={item.purchased ? "check-square-o" : "square-o"} 
                        size={24} 
                        color={item.purchased ? "#4CAF50" : "#ccc"} 
                    />
                </TouchableOpacity>
            }
            
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
            </View>
            
            {listType === "mercado" && 
                <Text style={styles.itemPrice}>
                    {typeof item.price === 'number'
                        ? item.price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })
                        : '--'}
                </Text>
            }
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
    itemsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    itemsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    checkedItem: {
        opacity: 0.6,
    },
    checkbox: {
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        color: '#333',
    },
    itemMeta: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
});