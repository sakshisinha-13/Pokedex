import axios from "axios";
import { useEffect, useState } from "react";
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";


function PokemonList() {
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [pokedexUrl,setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon/');

    const [nextUrl, setNextUrl] = useState('');
    const [prevUrl, setPrevUrl] = useState('');

    async function downloadPokemons() {
        setIsLoading(true);
        try {
            const response = await axios.get(pokedexUrl);
            const pokemonResults = response.data.results;

            console.log('response.data');
            setNextUrl(response.data.next);
            setPrevUrl(response.data.previous);

            const pokemonResultPromises = pokemonResults.map((pokemon) => axios.get(pokemon.url));
            const pokemonData = await axios.all(pokemonResultPromises);

            const res = pokemonData.map((pokeData) => {
                const pokemon = pokeData.data;
                return {
                    id: pokemon.id,
                    name: pokemon.name,
                    image: pokemon.sprites.other ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                    types: pokemon.types
                };
            });

            setPokemonList(res);
        } catch (error) {
            console.error('Error fetching Pokemon data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        downloadPokemons();
    }, [pokedexUrl]);

    return (
        <div className="pokemon-list-wrapper">
            
            <div className="pokemon-wrapper">
                {isLoading ? 'Loading.....' :
                    pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id}/>)
                }
            </div>
            <div className="controls">
                <button disabled={prevUrl==null} onClick={()=>setPokedexUrl(prevUrl)}>Previous</button>
                <button disabled={nextUrl==null} onClick={()=>setPokedexUrl(nextUrl)}>Next</button>
            </div>
        </div>
    );
}

export default PokemonList;