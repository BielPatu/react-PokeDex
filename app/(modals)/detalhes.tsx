import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function PokemonDetalhes() {
  const router = useRouter();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await AsyncStorage.getItem('selectedPokemonId');
        if (!id) throw new Error('ID do Pokémon não encontrado');
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(res.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#EA1C24" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.center}>
        <Text>Erro ao carregar dados do Pokémon.</Text>
        <Button title="Voltar" onPress={() => router.push('/')} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: pokemon.sprites.front_default }}
        style={styles.imagem}
      />
      <Text style={styles.nome}>
        #{pokemon.id} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </Text>

      <View style={styles.info}>
        <Text style={styles.label}>Tipo(s):</Text>
        <Text style={styles.value}>
          {pokemon.types.map((t) => t.type.name).join(', ')}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>Altura:</Text>
        <Text style={styles.value}>{pokemon.height / 10} m</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>Peso:</Text>
        <Text style={styles.value}>{pokemon.weight / 10} kg</Text>
      </View>

      <View style={styles.statusContainer}>
  {pokemon.stats.map((stat) => (
    <View key={stat.stat.name} style={styles.statusBox}>
      <Text style={styles.statName}>
        {stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}
      </Text>
      <Text style={styles.statValue}>{stat.base_stat}</Text>
    </View>
  ))}
</View>

      <Button title="Voltar" onPress={() => router.push('/')} color="#EA1C24" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F8FA',
    minHeight: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
  },
  imagem: {
    width: 160,
    height: 160,
    marginBottom: 25,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#EA1C24',
    backgroundColor: '#FFF',
    shadowColor: '#EA1C24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nome: {
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 30,
    color: '#EA1C24',
    textTransform: 'capitalize',
    textShadowColor: '#FFCDD2',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  info: {
    display: "flex",
    flexDirection: "row",
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  label: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginTop: 2,
    fontWeight: 'bold'
  },
  stat: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
    marginVertical: 2,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#EA1C24',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
  statusContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 8,
},

statusBox: {
  width: '48%',           
  backgroundColor: '#fff',
  paddingVertical: 15,
  paddingHorizontal: 10,
  borderRadius: 12,
  marginBottom: 12,
  shadowColor: '#999',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 4,
  alignItems: 'center',
},

statName: {
  fontSize: 16,
  fontWeight: '700',
  color: '#333',
  marginBottom: 5,
  textTransform: 'capitalize',
},

statValue: {
  fontSize: 20,
  fontWeight: '900',
  color: '#EA1C24',
},
});
