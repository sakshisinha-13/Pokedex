import axios from "axios";
import { useEffect, useState } from "react";


function usePokemonList() {
    const [pokemonListState, setPokemonListState] = useState({
        PokemonList: [],
        isLoading: true,
        pokedexUrl: 'https://pokeapi.co/api/v2/pokemon/',
        nextUrl: '',
        prevUrl: ''
    });

    async function downloadPokemons(url) {
        setPokemonListState((state) => ({
            ...state,
            isLoading: true
        }));

        try {
            const response = await axios.get(url || pokemonListState.pokedexUrl);
            const pokemonResults = response.data.results;

            setPokemonListState((state) => ({
                ...state,
                nextUrl: response.data.next,
                prevUrl: response.data.previous
            }));

            const pokemonResultPromises = pokemonResults.map((pokemon) => axios.get(pokemon.url));
            const pokemonData = await axios.all(pokemonResultPromises);

            const pokeListResult = pokemonData.map((pokeData) => {
                const pokemon = pokeData.data;
                return {
                    id: pokemon.id,
                    name: pokemon.name,
                    image: pokemon.sprites.other ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                    types: pokemon.types
                };
            });

            setPokemonListState((state) => ({
                ...state,
                PokemonList: pokeListResult,
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to download Pokemon data", error);
            setPokemonListState((state) => ({
                ...state,
                isLoading: false
            }));
        }
    }

    useEffect(() => {
        downloadPokemons();
    }, [pokemonListState.pokedexUrl]);

    return pokemonListState;
}

export default usePokemonList;
