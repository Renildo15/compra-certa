import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from "@/components/Themed";
import { useListDatabase } from "@/database/lists";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

// Dados mockados para exemplo
const mockItems = [
  { id: '1', name: 'Arroz', quantity: '1kg', price: 8.50, checked: false },
  { id: '2', name: 'Feijão', quantity: '1kg', price: 9.20, checked: true },
  { id: '3', name: 'Óleo', quantity: '900ml', price: 7.80, checked: false },
];

export default function List() {
    const { listId } = useLocalSearchParams();
    const router = useRouter();
    const listDatabase = useListDatabase();
    const [items, setItems] = useState(mockItems); // Estado para os itens

    // const [name, setName] = useState('');
    // const [type, setType] = useState('mercado');
    // const [month, setMonth] = useState('');
    // const [budget, setBudget] = useState('');

    // const [isListLoading, setIsLoading] = useState(true);
    
    // useEffect(() => {
    //     const fetchList = async () => {
    //         setIsLoading(true);
    //         if (!listId) return;
    //         try {
    //             const list = await listDatabase.getList(listId as string);
    //             if (list) {
    //                 setName(list.name);
    //                 setType(list.type);
    //                 setMonth(list.ref_month || '');
    //                 setBudget(list.budget?.value.toString() || '');
    //             }
    //         } catch (error) {
    //             console.error('Erro ao buscar lista:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }

    //     };
    //     fetchList();
    // }, [listId, listDatabase]);
    
    const { data: listData, isLoading: isListLoading } = useQuery({
        queryKey: ['listdetails', listId],
        queryFn: () => listDatabase.getList(listId as string),
        enabled: !!listId,
    });


    const handleAddItem = () => {
        // router.push(`/(list)/${listId}/new-item`);
    };

    const toggleItemChecked = (itemId: string) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === itemId ? { ...item, checked: !item.checked } : item
            )
        );
    };

    return (
        <ScrollView style={styles.container}>
            {isListLoading ? (
                <Text style={styles.loadingText}>Carregando lista...</Text>
            ) : (
                <>
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

                    <View style={styles.itemsContainer}>
                        <View style={styles.itemsHeader}>
                            <Text style={styles.itemsTitle}>Itens da Lista</Text>
                            <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
                                <FontAwesome name="plus" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {items.map(item => (
                            <View key={item.id} style={[styles.item, item.checked && styles.checkedItem]}>
                                <TouchableOpacity 
                                    onPress={() => toggleItemChecked(item.id)}
                                    style={styles.checkbox}
                                >
                                    <FontAwesome 
                                        name={item.checked ? "check-square-o" : "square-o"} 
                                        size={24} 
                                        color={item.checked ? "#4CAF50" : "#ccc"} 
                                    />
                                </TouchableOpacity>
                                
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemMeta}>{item.quantity}</Text>
                                </View>
                                
                                <Text style={styles.itemPrice}>
                                    {item.price.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
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