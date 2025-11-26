import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const PAGE_LIMIT = 20;

export default function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  const fetchPokemonList = async () => {
    if (loading || loadingMore) return;

    if (offset === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_LIMIT}&offset=${offset}`
      );
      const data = await res.json();

      const novosPokemons = await Promise.all(
        data.results.map(async (pokemon) => {
          const urlParts = pokemon.url.split('/');
          const id = urlParts[urlParts.length - 2];

          const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

          const resDetalhes = await fetch(pokemon.url);
          const detalhes = await resDetalhes.json();
          const tipos = detalhes.types.map((t) => t.type.name);

          return {
            id,
            nome: pokemon.name,
            imagem,
            tipos,
          };
        })
      );

      setPokemonList((oldList) => [...oldList, ...novosPokemons]);
      setOffset((oldOffset) => oldOffset + PAGE_LIMIT);
    } catch (error) {
      console.error('Erro ao buscar pokemons:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handlePress = async (id) => {
  try {
    await AsyncStorage.setItem('selectedPokemonId', id.toString());
    router.push('/(modals)/detalhes'); // vamos criar rota fixa para modal
  } catch (error) {
    console.error('Erro salvando ID no AsyncStorage:', error);
  }
};

  useEffect(() => {
    fetchPokemonList();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredList(pokemonList);
      return;
    }

    const filtro = pokemonList.filter((p) =>
      p.nome.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtro);
  }, [search, pokemonList]);

  const renderPokemon = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.id)}>
      <Image source={{ uri: item.imagem }} style={styles.imagem} />
      <Text style={styles.nome}>
        #{item.id} {item.nome.charAt(0).toUpperCase() + item.nome.slice(1)}
      </Text>
      <Text style={styles.tipos}>Tipo: {item.tipos.join(', ')}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Pokédex</Text>
      <TextInput
        placeholder="Buscar Pokémon"
        style={styles.input}
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {loading && offset === 0 ? (
        <ActivityIndicator size="large" color="#EA1C24" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id}
          renderItem={renderPokemon}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 30 }}
          onEndReached={fetchPokemonList}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#EA1C24" /> : null
          }
          ListEmptyComponent={
            <Text style={{ marginTop: 50, fontSize: 18 }}>Nenhum Pokémon encontrado</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#EA1C24',
  },
  input: {
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 15,
    elevation: 3,
  },
  imagem: {
    width: 96,
    height: 96,
    marginBottom: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tipos: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
