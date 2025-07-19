import { Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import CardList from "../CardList";
import { Text, View } from "../Themed";
import { useState } from "react";
import useDoubleTap from "@/hooks/useDoubleTap";
import { ListWithBudget } from "@/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useListDatabase } from "@/database/lists";
import { useQueryClient } from "@tanstack/react-query";

interface ListListProps {
    list: ListWithBudget[];
}

export default function ListList({ list }: ListListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  

  const listDatabase = useListDatabase();
  const queryClient = useQueryClient();
  
  const handleToggleCheckbox = (id: string, isChecked: boolean) => {
    setSelectedIds(prev =>
      isChecked
        ? [...prev, id] // Adiciona quando marcado
        : prev.filter(itemId => itemId !== id) // Remove quando desmarcado
    );
  };

  const handleDoubleTap = () => {
    setShowCheckboxes(!showCheckboxes);
    if (showCheckboxes) {
      setSelectedIds([]); // Limpa seleção ao esconder checkboxes
    }
  };

  const cleanSelection = () => {
    setSelectedIds([]);
    setShowCheckboxes(false);
  };

  const handleSelectAll = () => {
    if (showCheckboxes) {
      setSelectedIds(list.map(item => item.id)); // Seleciona todos os itens
    } else {
      setShowCheckboxes(true); // Ativa o modo de seleção
    }
  };

  const handleRemoveAll = () => {
    setSelectedIds([]);
    setShowCheckboxes(false);
  }
  const handleDeleteLists = async () => {
    try {
      await listDatabase.removeAll(selectedIds);

      await queryClient.invalidateQueries({ queryKey: ['lists'] });
      setSelectedIds([]);
      setShowCheckboxes(false);
      Alert.alert('Sucesso', 'Listas removidas com sucesso!');
    } catch (error) {
      console.error('Erro ao remover listas:', error);
      Alert.alert('Erro', 'Não foi possível remover as listas selecionadas.'); 
    }
  }

  const handleDeleteConfirmation = () => {
    if (selectedIds.length === 0 ) {
      Alert.alert('Nenhum item selecionado', 'Por favor, selecione pelo menos um item para excluir.');
      return;
    }

    Alert.alert(
      'Confirmação de Exclusão',
      `Você tem certeza que deseja excluir ${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            handleDeleteLists();
            setSelectedIds([]);
            setShowCheckboxes(false);
          },
        },
      ],
      { cancelable: true }
    )

  }

  const headerFlatList = () => (
    (showCheckboxes) ? (
      <View style={{ padding: 16, marginHorizontal:16, backgroundColor: 'transparent', borderBottomWidth: 1, borderColor: '#ddd' }}>
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent' }}>
         <Text style={{ fontSize: 16, fontWeight: 'bold', backgroundColor: 'transparent' }}>
          {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selecionado{selectedIds.length > 1 ? 's' : ''}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, backgroundColor: 'transparent' }}>
          <TouchableOpacity
            onPress={() => handleDeleteConfirmation()}
            disabled={selectedIds.length === 0}
            style={{ opacity: selectedIds.length === 0 ? 0.5 : 1 }}
          >
            <FontAwesome name="trash" size={20} color="#ff0000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('Editar selecionados')}
            disabled={selectedIds.length === 0}
            style={{ opacity: selectedIds.length === 0 ? 0.5 : 1 }}
          >
            <FontAwesome name="edit" size={20} color="#007BFF" />
          </TouchableOpacity>
        </View>
       </View>
       <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
         <TouchableOpacity onPress={cleanSelection}>
          <Text style={{ color: '#007BFF' }}>Limpar seleção</Text>
        </TouchableOpacity>
        { selectedIds.length === list.length ? (
          <TouchableOpacity onPress={handleRemoveAll}>
          <Text style={{ color: '#dc3545' }}>Desmarcar todos</Text>
        </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSelectAll}>  
            <Text style={{ color: '#28a745' }}>Selecionar todos</Text>
          </TouchableOpacity>
        )}
       </View>
      </View>
    ) :null
  );
  const onPress = useDoubleTap(handleDoubleTap, 300);
  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
           <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
             <CardList
              list={item}
              showCheckboxInitially={showCheckboxes}
              isChecked={selectedIds.includes(item.id)}
              onToggleCheckbox={handleToggleCheckbox}
            />
           </TouchableOpacity>
      )}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={headerFlatList}
      ListEmptyComponent={() => (
        <Text style={styles.emptyText}>Nenhuma lista encontrada</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  }
});
