import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";

export default function ItemHeader() {
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