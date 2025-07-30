import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { ListWithBudget } from "@/types";
import { useBudget } from "@/hooks/useBudget";

interface ListHeaderProps {
    listData: ListWithBudget | null | undefined
}

export default function ListHeader( { listData }:ListHeaderProps) {
    const {expenseValue, restValue} = useBudget();
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
            <View style={styles.budgetContainerExpense}>
                <Text style={styles.budgetTextExpense}>
                    Despesas: {expenseValue.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                    })}
                </Text>
            </View>
            <View style={styles.budgetContainerRest}>
                <Text style={styles.budgetTextRest}>
                    Restante: {restValue.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL'
                    })}
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
    budgetContainerExpense: {
        backgroundColor: '#ffebee',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    budgetTextExpense: {
        fontSize: 16,
        fontWeight: '600',
        color: '#c62828',
        textAlign: 'center',
    },
    budgetContainerRest: {
        backgroundColor: '#fff3e0',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    budgetTextRest: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f57c00',
        textAlign: 'center',
    },
});