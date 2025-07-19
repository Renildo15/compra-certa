import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useListDatabase } from '@/database/lists';
import ListList from '@/components/ListList';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function HomeScreen() {
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
      <Text style={styles.title}>📋 Minhas Listas</Text>
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