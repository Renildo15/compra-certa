import Input from "@/components/Input";
import { Text, View } from "@/components/Themed";
import TypeSelect from "@/components/TypeSelect";
import { useListDatabase } from "@/database/lists";
import { ListType } from "@/types/lists";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
//TODO: corrigir problema de editar múltiplas listas
export default function EditList() {
  const params = useLocalSearchParams();
  const ids = (params.listId as string).split(',');

  const [id, setId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('mercado');
  const [month, setMonth] = useState('');
  const [budget, setBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listDatabase = useListDatabase();
  const queryClient = useQueryClient();
  const router = useRouter();

  // useEffect(() => {

  //   const getList = async () => {
  //     if (ids.length === 0) return;

  //     setIsLoading(true);
  //     setError(null);

  //     try {

  //       if (ids.length === 1) {
  //         const list = await listDatabase.getList(ids[0]);
  //         if (list) {
  //           setId(list.id);
  //           setName(list.name);
  //           setType(list.type);
  //           setMonth(list.ref_month || '');
  //           setBudget(list.budget?.value.toString() || '');
  //         } else {
  //           setError('Lista não encontrada');
  //         }
  //       } else {
          
  //       }
  //     } catch (err) {
  //       setError('Erro ao carregar lista');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   getList();
  // }, [ids]);

  const { data: listData, isLoading: isListLoading } = useQuery({
    queryKey: ['list', ids[0]],
    queryFn: () => ids.length === 1 ? listDatabase.getList(ids[0]) : null,
    enabled: !!ids[0] && ids.length === 1
  });

  const handleSave = async () => {
    if (!name || !type) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    } 

    setIsLoading(true);
    setError(null);

    try {
      const updates = [{
        list: {
          id: id || '',
          name,
          type: type as ListType,
          ref_month: month || undefined,
          created_at: new Date().toISOString(),
        },
        budget: budget ? {
          id: id || new Date().getTime().toString(),
          value: parseFloat(budget.replace('R$', '').replace(',', '.')),
        } : undefined
      }]

      await listDatabase.updateMultipleLists(updates);

      Alert.alert('Sucesso', 'Lista atualizada com sucesso!');
      setName('');
      setType('mercado');
      setMonth('');
      setBudget('');
      setId(null);
      await queryClient.invalidateQueries({ queryKey: ['lists'] });
      router.back();
    } catch (err) {
      setError('Erro ao salvar alterações');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: 'transparent', marginBottom: 20}}>
        {ids.length > 1 ? (
          <Text style={styles.title}>Editando {ids.length} listas</Text> 
        ) : (
          <Text style={styles.title}>Editando Lista</Text>
        )}
      </View>
      <Input
        label="Nome da Lista"
        value={listData?.name || name}
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
            value={listData?.ref_month || month}
            onChangeText={setMonth}
            placeholder='2025-07'
          />
          <Input
            label='Orçamento'
            value={listData?.budget?.value.toString() || budget}
            onChangeText={setBudget}
            placeholder='R$ 100,00'
            keyboardType='numeric'
          />
        </>
      )}
      <View style={{ marginTop: 20, width: '100%' }}>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          style={[styles.button, isLoading && styles.disabledButton]}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
             Salvar Alterações  
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
   button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#f44336',
    marginTop: 10,
    textAlign: 'center',
  },
});