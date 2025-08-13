import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useListDatabase } from '@/database/lists';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native-paper';
import ListList from '@/components/ListList';

export default function HistoryScreen() {
  const listDatabase = useListDatabase();

  const { data: lists = [], isLoading} = useQuery({
    queryKey: ['lists'],
    queryFn: () => listDatabase.getListsWithBudgets(),
  })

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Histórico</Text>
      <ListList list={lists}/>
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f9fafb', // cinza bem claro
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  }
});
