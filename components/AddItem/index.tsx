import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import uuid from 'react-native-uuid';
import { Button, Portal, Modal, useTheme } from 'react-native-paper';
import Input from '../Input';
import { useItemDatabase } from '@/database/items';
import { Text } from '../Themed';

interface AddItemFormProps {
    listType: "mercado" | "pedido";
    listId: string; // Assuming you need a listId to associate the item with a list
    onItemAdded?: () => void;

}

export default function AddItemForm({ listType = "mercado", listId, onItemAdded }: AddItemFormProps) {
    const [visible, setVisible] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [itemObservation, setItemObservation] = useState('');
    const theme = useTheme();


    const itemDatabase = useItemDatabase();
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleAddItem = async () => {
        setIsLoading(true);
        setError(null);
        if (!itemName.trim()) {
            Alert.alert('Erro', 'O nome do item é obrigatório.');
            setIsLoading(false);
            return;
        }

        if (!itemQuantity.trim() || isNaN(Number(itemQuantity))) {
            Alert.alert('Erro', 'A quantidade deve ser um número válido.');
            setIsLoading(false);
            return;
        }

        const id = String(uuid.v4());
        const createdAt = new Date().toISOString();

        try {
            await itemDatabase.create({
                id,
                name: itemName.trim(),
                quantity: itemQuantity.trim(),
                price: listType === "mercado" ? parseFloat(itemPrice.trim() || '0') : 0,
                category: listType === "mercado" ? itemCategory.trim() : '',
                observation: listType === "mercado" ? itemObservation.trim() : '',
                listId,
                created_at: createdAt,
            })

            Alert.alert('Sucesso', 'Item adicionado com sucesso!');
            setItemName('');
            setItemQuantity('');
            setItemPrice('');
            setItemCategory('');
            setItemObservation('');
            hideModal();
           if (onItemAdded) {
                await onItemAdded();
            }
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            setError('Falha ao adicionar item. Tente novamente.');
            Alert.alert('Erro', 'Falha ao adicionar item. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View>
            <Button 
                mode="contained" 
                onPress={showModal}
                style={styles.addButton}
                icon="plus"
            >
                Adicionar Item
            </Button>

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={[
                        styles.modalContainer,
                        { backgroundColor: theme.colors.background }
                    ]}
                >
                    <View style={styles.formContainer}>
                    <Input
                        label="Nome do Item"
                        value={itemName}
                        onChangeText={setItemName}
                        style={styles.input}
                        placeholder="Ex: Arroz"
                        autoFocus
                    />

                    <Input
                        label="Quantidade"
                        value={itemQuantity}
                        onChangeText={setItemQuantity}
                        style={styles.input}
                        keyboardType='numeric'
                        placeholder="Ex: 1"
                    />
                    { listType === "mercado" && (
                        <>
                            <Input
                                label="Preço"
                                value={itemPrice}
                                onChangeText={setItemPrice}
                                style={styles.input}
                                placeholder="Ex: 8.50"
                                keyboardType="numeric"
                            />

                            <Input
                                label="Categoria"
                                value={itemCategory}
                                onChangeText={setItemCategory}
                                style={styles.input}
                                placeholder="Ex: Grãos"
                            />

                            <Input
                                label="Observação"
                                value={itemObservation}
                                onChangeText={setItemObservation}
                                style={styles.input}
                                placeholder="Ex: Preferência por orgânico"
                            />
                            {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
                        </>
                    )}
                    

                    <View style={styles.buttonRow}>
                        <Button 
                            mode="outlined" 
                            onPress={hideModal}
                            textColor='#4CAF50'
                            style={[styles.button, {borderColor: "#4CAF50"}]}
                        >
                            Cancelar
                        </Button>
                    
                        <Button 
                            mode="contained" 
                            onPress={handleAddItem}
                            style={[styles.button, { backgroundColor: "#4CAF50", opacity: itemName.trim() ? 1 : 0.5 }]}
                            disabled={!itemName.trim()}
                        >
                            {isLoading ? 'Adicionando...' : 'Adicionar Item'}
                        </Button>
                    </View>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
  addButton: {
    margin: 16,
     backgroundColor: '#4CAF50',
  },
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  formContainer: {
    padding: 10,
  },
  input: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    flex: 1,
    color: '#4CAF50',
  },
});