
import { Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { ListType } from '@/types/lists';
import { useListDatabase } from '@/database/lists';
import Input from '@/components/Input';
import TypeSelect from '@/components/TypeSelect';
import uuid from 'react-native-uuid';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useBudgetDatabase } from '@/database/budgets';

export default function NewListScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState<ListType>('mercado');
  const [month, setMonth] = useState('');
  const [budget, setBudget] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listDatabase = useListDatabase();
  const budgetDatabase = useBudgetDatabase();
  const queryClient = useQueryClient();

  const route = useRouter()

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    if (!name) {
      Alert.alert('Error', 'Preencha o nome da lista.');
      setIsLoading(false);
      return;
    }
    const id = String(uuid.v4());
    const createdAt = new Date().toISOString();
    const refMonth = type === 'mercado' ? month : '';

    try {
      await listDatabase.create({
        id,
        name,
        type,
        ref_month: refMonth,
        created_at: createdAt,
      })

      if (type === 'mercado' && budget) {
        await budgetDatabase.create({
          id: String(uuid.v4()),
          listId: id,
          value: parseFloat(budget.replace('R$', '').replace(',', '.')),
        })
      }

      Alert.alert('Success', 'List created successfully!');
      setName('');
      setType('mercado');
      setMonth('');
      setBudget('');

      await queryClient.invalidateQueries({ queryKey: ['lists'] });
      route.push('/(tabs)');
    } catch (error) {
      console.error('Error creating list:', error);
      setError('Failed to create list. Please try again.');
      Alert.alert('Error', 'Failed to create list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }  

  return (
    <View style={styles.container}>
      <Input
        label="Nome da Lista"
        value={name}
        onChangeText={setName}
        placeholder="Digite o nome da lista"
      />
      <TypeSelect
        label="Tipo de Lista"
        value={type}
        onChange={(val: string) => setType(val as ListType)}
      />

      { type === 'mercado' && (
        <>
          <Input
            label='Mês de Referência'
            value={month}
            onChangeText={setMonth}
            placeholder='2025-07'
          />
          <Input
            label='Orçamento'
            value={budget}
            onChangeText={setBudget}
            placeholder='R$ 100,00'
            keyboardType='numeric'
          />
        </>
      )}
      <View style={{ marginTop: 20, width: '100%' }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#4caf50',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Criar Lista
            </Text>
          )}
        </TouchableOpacity>
        {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
});