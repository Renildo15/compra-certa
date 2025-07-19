import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const tipos = ['mercado', 'pedido'];

export default function TypeDropdown({ value, onChange }: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.box} onPress={() => setOpen(true)}>
        <Text>{value || 'Selecione o tipo'}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.modal}>
            {tipos.map(tipo => (
              <TouchableOpacity key={tipo} onPress={() => {
                onChange(tipo);
                setOpen(false);
              }}>
                <Text style={styles.item}>{tipo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    minWidth: 200,
  },
  item: {
    fontSize: 18,
    paddingVertical: 10,
  }
});
