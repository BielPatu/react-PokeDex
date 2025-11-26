import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/detalhes"
        options={{ presentation: 'modal', title: 'Detalhes do Pokémon' }}
      />
    </Stack>
  );
}
