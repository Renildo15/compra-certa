import { useState } from "react";
import { Button, Modal, Portal, useTheme } from "react-native-paper";
import { View } from "../Themed";
import { StyleSheet } from "react-native";
import Input from "../Input";

interface UpdatePriceItemProps {
    listType: "mercado" | "pedido";
    listId: string; // Assuming you need a listId to associate the item with a list
    onItemAdded?: () => void;
    visible: boolean;
    setVisible: (visible: boolean) => void;

}

export default function UpdatePriceItem({ listId, listType, onItemAdded , setVisible, visible}: UpdatePriceItemProps) {
    const [price, setPrice] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();

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
                            // onPress={handleAddItem}
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