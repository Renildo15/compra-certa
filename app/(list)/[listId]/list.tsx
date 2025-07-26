import { StyleSheet, ScrollView } from 'react-native';
import { Text } from "@/components/Themed";
import { useListDatabase } from "@/database/lists";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import ItemsList from '@/components/ItemsList';
import ListHeader from '@/components/ListHeader';

export default function List() {
    const { listId } = useLocalSearchParams();
    const listDatabase = useListDatabase();

    const { data: listData, isLoading: isListLoading } = useQuery({
        queryKey: ['listdetails', listId],
        queryFn: () => listDatabase.getList(listId as string),
        enabled: !!listId,
    });


    return (
        <ScrollView style={styles.container}>
            {isListLoading ? (
                <Text style={styles.loadingText}>Carregando lista...</Text>
            ) : (
                <>
                    <ListHeader listData={listData}/>
                    <ItemsList/>
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
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
});