import { useState } from "react";
import { Button, Modal, Portal, useTheme } from "react-native-paper";
import { View } from "../Themed";
import { Alert, StyleSheet } from "react-native";
import Input from "../Input";
import { useItemDatabase } from "@/database/items";

interface UpdatePriceItemProps {
    itemId: string;
    onItemUpdated?: () => void;
    visible: boolean;
    setVisible: (visible: boolean) => void;

}

export default function UpdatePriceItem({onItemUpdated , setVisible, visible, itemId}: UpdatePriceItemProps) {
    const [price, setPrice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const itemDatabase = useItemDatabase();

    const handleSave = async () => {
        setIsLoading(true);

        if (!price.trim() || isNaN(Number(price))) {
            setIsLoading(false);
            return;
        }

        try {
            await itemDatabase.updateItemPrice(itemId, parseFloat(price.trim()));
            setPrice('');

            Alert.alert('Sucesso', 'Item adicionado com sucesso!');

            setIsLoading(false);
            setVisible(false);
            if (onItemUpdated) {
                onItemUpdated();
            }
            
        } catch (error) {
            Alert.alert('Erro', 'Erro ao atualizar o preço. Tente novamente.');
            console.error('Erro ao atualizar o preço:', error);
            setIsLoading(false);
        }
    }

    return (
        <View style={{backgroundColor: '#fff',}}>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={[
                        styles.modalContainer,
                        { backgroundColor: '#fff' }
                    ]}
                >
                    <View style={styles.formContainer}>
                    <Input
                        label="Digite o preço"
                        value={price}
                        onChangeText={setPrice}
                        style={styles.input}
                        placeholder="Digite o novo preço"
                        keyboardType="numeric"
                        autoFocus
                    />

                    <View style={styles.buttonRow}>
                        <Button 
                            mode="outlined" 
                            onPress={() => setVisible(false)}
                            textColor='#4CAF50'
                            style={[styles.button, {borderColor: "#4CAF50"}]}
                        >
                            Cancelar
                        </Button>
                    
                        <Button 
                            mode="contained" 
                            onPress={handleSave}
                            loading={isLoading}
                            style={[styles.button, { backgroundColor: "#4CAF50", opacity: price.trim() ? 1 : 0.5 }]}
                            disabled={!price.trim()}
                        >
                            {isLoading ? "Atualizando..." : "Atualizar Preço"}
                        </Button>
                    </View>
                    </View>
                </Modal>
            </Portal>
        </View>
    )
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
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 10,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
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