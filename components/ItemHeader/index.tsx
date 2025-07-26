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
});