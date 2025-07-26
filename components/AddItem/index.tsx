import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Portal, Modal, useTheme } from 'react-native-paper';
import Input from '../Input';

interface AddItemFormProps {
    listType: "mercado" | "pedido";
}

export default function AddItemForm({ listType = "mercado" }: AddItemFormProps) {
    const [visible, setVisible] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [itemObservation, setItemObservation] = useState('');
    const [itemListId, setItemListId] = useState(''); // Assuming you have a list ID to associate with the item
    const theme = useTheme();

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleAddItem = () => {
        // Aqui você adicionaria o item à sua lista
        console.log('Adicionando item:', itemName);
        hideModal();
        setItemName('');
        setItemQuantity('');
        setItemPrice('');
        setItemCategory('');
        setItemObservation('');
        setItemListId(''); // Reset the list ID if necessary
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
                            Adicionar
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