import { ListWithBudget } from '@/types';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Item } from '@/types/items';
import { Link } from 'expo-router';
import { useBudget } from '@/hooks/useBudget';
import { useItemDatabase } from '@/database/items';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { formatReferenceMonth } from '@/utils/format-reference-month';

interface CardListProps {
  list: ListWithBudget;
  showCheckboxInitially?: boolean;
  isChecked: boolean;
  onToggleCheckbox: (id: string, isChecked: boolean) => void;
}

export default function CardList({ list, showCheckboxInitially = false, isChecked, onToggleCheckbox }: CardListProps) {
  const itemDatabase = useItemDatabase();
  const {budgetsExpense, setBudgetsExpense } = useBudget();

  const expenses = budgetsExpense.filter((exp) => exp.list_id === list?.id);
  const totalExpense = expenses.reduce((acc, item) => {
    return acc + item.list_expense_value
  }, 0)

  const loadList = async () => {
    try {
      const storedData = await AsyncStorage.getItem('lists_expense');
      if (storedData !== null)  {
          const parsedList = JSON.parse(storedData);
          setBudgetsExpense(parsedList)
          return parsedList;
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
      return [];
    }
  }

  useEffect(() => {
    loadList() 
  },[])

  function generateShareText(list: ListWithBudget, items: Item[]) {
    let text = `📋 *${list.name.trim()}* - ${list.type === 'mercado' ? '🛒 Mercado' : '📦 Pedido'}\n`;

    if (list.ref_month) {
      text += `📅 Mês: ${formatReferenceMonth(list.ref_month)}\n`;
    }

    if (list.budget?.value !== undefined) {
      text += `💰 Orçamento: ${list.budget.value_original.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
    } else {
      text += `💰 Orçamento: Não definido\n`;
    }

    text += `\n📝 Itens:\n`;
    items.forEach(item => {
      text += `- ${item.name}`;
      if(item.quantity) text += ` (x${item.quantity})`;
      if(item.price) text += ` - ${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
      text += `\n`;
    })

    return text;
  }

  async function shareList() {
    const items: Item[] = await itemDatabase.getItems(list.id);

    const shareText = generateShareText(list, items);

    Share.share({
      message: shareText,
      title: `Compartilhar lista: ${list.name}`,
    })
      .catch(error => {
        console.error('Erro ao compartilhar lista:', error);
        Alert.alert('Erro', 'Não foi possível compartilhar a lista.');
      });

  }

  return (
    <View style={[
      styles.card,
      showCheckboxInitially && styles.cardSelectionMode, // Modo seleção ativo
      isChecked && styles.cardSelected // Item selecionado
    ]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.title}> {list.name}</Text>
          
          {showCheckboxInitially ? (
            <Checkbox
              value={isChecked}
              onValueChange={(newValue) => onToggleCheckbox(list.id, newValue)}
              style={{ marginLeft: 8 }}
              color={isChecked ? '#4caf50' : undefined} // Cor verde quando selecion
            />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '20%' }}>
              <Link href={`/(list)/${list.id}/list`}>
                <FontAwesome name="eye" size={20} color="#007BFF" />
              </Link>
              <TouchableOpacity
                onPress={shareList}
              >
                <FontAwesome name="share" size={20} color="#28a745" />
              </TouchableOpacity>
              
            </View>
          )}
        </View>
        <Text style={styles.title}>
          {list.type === 'mercado' ? '🛒 Mercado' : '📦 Pedido'} 
          {list.ref_month ? ` - ${formatReferenceMonth(list.ref_month)}` : ' --/--'}
        </Text>
      </View>
      {list.type === 'mercado' && (
        <>
          <Text style={styles.orcamento}>
            💰 Orçamento: {list.budget?.value !== undefined ? 
              list.budget.value_original.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }) : 
              'Não definido'}
          </Text>
          <Text style={styles.gastos}>Gasto: 
            {totalExpense.toLocaleString('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            })} | Saldo: 
            {list?.budget?.value
            ? Number(list.budget.value).toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
            })
            : 'Não definido'}
            </Text>
          </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#4caf50', // Cor padrão
    opacity: 1,
    transform: [{ scale: 1 }],
    transitionProperty: 'all',
    transitionDuration: '200ms',
  },
  // Estilo quando o modo seleção estiver ativo
  cardSelectionMode: {
    borderLeftColor: '#ddd', // Cor mais neutra
    backgroundColor: '#f8f8f8',
  },
  // Estilo quando o item estiver selecionado
  cardSelected: {
    backgroundColor: '#e8f5e9', // Verde bem claro
    borderLeftColor: '#2e7d32', // Verde mais escuro
    transform: [{ scale: 1.01 }],
    shadowOpacity: 0.25,
  },
  header: {
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  orcamento: {
    fontSize: 16,
    color: '#2e7d32',
    marginTop: 4,
  },
  gastos: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});