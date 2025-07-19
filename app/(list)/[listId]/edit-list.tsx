import Input from "@/components/Input";
import { Text, View } from "@/components/Themed";
import TypeSelect from "@/components/TypeSelect";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";

export default function EditList() {
    const params = useLocalSearchParams();
    const ids = (params.listId as string).split(',');
    const listId = ids[0]; // Assuming you want to use the first ID for
    console.log("lists ids", ids);
    return (
        <View style={styles.container}>
            <Text>{listId}</Text>
          {/* <Input
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
          </View> */}
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