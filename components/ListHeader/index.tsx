import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { ListWithBudget } from "@/types";

interface ListHeaderProps {
    listData: ListWithBudget | null | undefined
}

export default function ListHeader( { listData }:ListHeaderProps) {
    return (
        <View style={styles.header}>
            <Text style={styles.listName}>{listData?.name || 'Lista não encontrada'}</Text>
            
            <View style={styles.metaContainer}>
                <Text style={styles.metaText}>Tipo: {listData?.type}</Text>
                <Text style={styles.metaText}>Mês: {listData?.ref_month || '--/--'}</Text>
            </View>
            
            <View style={styles.budgetContainer}>
                <Text style={styles.budgetText}>
                    Orçamento: {listData?.budget?.value
                        ? Number(listData.budget.value).toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                        })
                        : 'Não definido'}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    listName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    metaText: {
        fontSize: 14,
        color: '#666',
    },
    budgetContainer: {
        backgroundColor: '#e8f5e9',
        padding: 10,
        borderRadius: 8,
    },
    budgetText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2e7d32',
        textAlign: 'center',
    },
});