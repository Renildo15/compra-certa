import { Stack } from "expo-router";

export default function ListRootLayout() {
  return (
    <Stack>
      {/* Configuração padrão para todas as telas do grupo */}
      <Stack.Screen
        name="[listId]/edit-list"
        options={{
          headerShown: true,
          title: "Editar Lista",
          headerBackTitle: "Voltar"
        }}
      />
      
      {/* Tela de nova lista com header personalizado */}
      <Stack.Screen 
        name="new-list"
        options={{
          presentation: 'modal',
          headerShown: true, // Garante que o header está visível
          title: "Nova Lista", // Título personalizado
          headerBackTitle: "Fechar" // Texto para o botão de voltar
        }}
      />
      {/* Tela de visualização de lista */}
      <Stack.Screen
        name="[listId]/list"
        options={{
          headerShown: true,
          title: "Lista",
          headerBackTitle: "Voltar"
        }}
      />
    </Stack>
  );
}