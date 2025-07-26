import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";
import { FontAwesome } from "@expo/vector-icons";

interface ItemHeaderProps {
    handleAddItem: () => void;
}

export default function ItemHeader({ handleAddItem }: ItemHeaderProps) {
    return (
        <View style={styles.itemsHeader}>
            <Text style={styles.itemsTitle}>Itens da Lista</Text>
            <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
                <FontAwesome name="plus" size={18} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
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
});