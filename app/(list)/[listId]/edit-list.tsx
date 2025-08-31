import Input from "@/components/Input";
import { Text, View } from "@/components/Themed";
import TypeSelect from "@/components/TypeSelect";
import { useListDatabase } from "@/database/lists";
import { ListType } from "@/types/lists";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";

export default function EditList() {
  const params = useLocalSearchParams();
  const ids = (params.listId as string).split(',');
  const isBulk = ids.length > 1;

  const listDatabase = useListDatabase();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: listData, isLoading: isListLoading } = useQuery({
    queryKey: ['list', ids[0]],
    queryFn: () => ids.length === 1 ? listDatabase.getList(ids[0]) : null,
    enabled: !!ids[0] && !isBulk,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
  });

  const [name, setName] = useState('');
  const [type, setType] = useState('mercado');
  const [month, setMonth] = useState('');
  const [budget, setBudget] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isBulk && listData) {
      setName(listData.name || "");
      setType((listData.type as ListType) || "mercado");
      setMonth(listData.ref_month || "");
      setBudget(listData.budget?.value != null ? String(listData.budget.value) : "");
    }
  }, [isBulk, listData])
 
  const parseCurrencyToNumber = (raw: string) => {
    if (!raw.trim()) return undefined;
    // remove R$, espaços e separador de milhar (.)
    const cleaned = raw.replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", ".");
    const n = Number(cleaned);
    return isNaN(n) ? undefined : n;
  };

  const handleSave = async () => {
    if (!name.trim() || !type) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // orçamento só é obrigatório para listas de mercado
    if (type === "mercado" && !budget.trim()) {
      setError('Informe o orçamento para listas do tipo "mercado".');
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      const parsedBudget = type === "mercado" ? parseCurrencyToNumber(budget) : undefined;
      const updates = ids.map((listId) => ({
        list: {
          id: listId,
          name: name.trim(),
          type: type as ListType,
          ref_month: month || undefined,
          created_at: new Date().toISOString(),
        },
        budget:
          type === "mercado" && parsedBudget != null
            ? {
                id: listId, // use o id da lista como id do orçamento (ajuste se seu schema for diferente)
                value: parsedBudget,
              }
            : undefined,
      }));
      console.log("AQUI: ", updates)
      await listDatabase.updateMultipleLists(updates);

      await queryClient.invalidateQueries({ queryKey: ["lists"] });
      if (!isBulk && ids[0]) {
        await queryClient.invalidateQueries({ queryKey: ["list", ids[0]] });
      }

      Alert.alert("Sucesso", isBulk ? "Listas atualizadas com sucesso!" : "Lista atualizada com sucesso!");
      router.back();
    } catch (err) {
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false)
    }
  };

  const loading = isListLoading || ( !isBulk && !listData && ids.length === 1 );
  
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "transparent", marginBottom: 20 }}>
        {isBulk ? (
          <Text style={styles.title}>Editando {ids.length} listas</Text>
        ) : (
          <Text style={styles.title}>Editando Lista</Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Input
            label="Nome da Lista"
            value={name}
            onChangeText={setName}
            placeholder="Digite o nome da lista"
          />

          { !isBulk && (
            <TypeSelect
              label="Tipo de Lista"
              value={type}
              onChange={(val: string) => setType(val as ListType)}
            />
          )}

          {type === "mercado" && (
            <>
              {!isBulk && (
                 <Input
                  label="Mês de Referência"
                  value={month}
                  onChangeText={setMonth}
                  placeholder="2025-07"
                />
              )}
              <Input
                label="Orçamento"
                value={budget}
                onChangeText={setBudget}
                placeholder="R$ 100,00"
                keyboardType="numeric"
              />
            </>
          )}

          <View style={{ marginTop: 20, width: "100%" }}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              style={[styles.button, isSaving && styles.disabledButton]}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                  Salvar Alterações
                </Text>
              )}
            </TouchableOpacity>

            {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
          </View>
        </>
      )}
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