import { useItemDatabase } from "@/database/items";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "../Themed";
import { useEffect, useState } from "react";
import { Button, Modal, Portal, useTheme } from "react-native-paper";
import Input from "../Input";
import { StyleSheet } from "react-native";

interface UpdateItemProps {
    itemId: string;
    onItemUpdated?: () => void;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    listType?: "mercado" | "pedido";
}

export default function UpdateItem({ itemId, setVisible, visible, onItemUpdated, listType}:UpdateItemProps) {
    const itemDatabase = useItemDatabase();
    const { data: itemData, isLoading: isItemLoading } = useQuery({
        queryKey: ['itemdetails', itemId],
        queryFn: () => itemDatabase.getItem(itemId),
        enabled: !!itemId,
    });
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [observation, setObservation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (!itemData) return;
        setName(itemData.name ?? '');
        setQuantity(itemData.quantity != null ? String(itemData.quantity) : '');
        setPrice(itemData.price != null ? String(itemData.price) : '');
        setCategory(itemData.category ?? '');
        setObservation(itemData.observation ?? '');
    }, [itemData?.id]);

    const [error, setError] = useState<string | null>(null);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    return (
        <View>
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
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholder="Ex: Arroz"
                        autoFocus
                    />

                    <Input
                        label="Quantidade"
                        value={quantity}
                        onChangeText={setQuantity}
                        style={styles.input}
                        keyboardType='numeric'
                        placeholder="Ex: 1"
                    />
                    { listType === "mercado" && (
                        <>
                            <Input
                                label="Preço"
                                value={price}
                                onChangeText={setPrice}
                                style={styles.input}
                                placeholder="Ex: 8.50"
                                keyboardType="numeric"
                            />

                            <Input
                                label="Categoria"
                                value={category}
                                onChangeText={setCategory}
                                style={styles.input}
                                placeholder="Ex: Grãos"
                            />

                            <Input
                                label="Observação"
                                value={observation}
                                onChangeText={setObservation}
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
                            // onPress={handleAddItem}
                            style={[styles.button, { backgroundColor: "#4CAF50", opacity: name.trim() ? 1 : 0.5 }]}
                            disabled={!name.trim()}
                        >
                            {isLoading ? 'Adicionando...' : 'Adicionar Item'}
                        </Button>
                    </View>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
}

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