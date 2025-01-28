"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function PokemonDetails() {
  const { id } = useParams(); // Obtém o ID do Pokémon da URL
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/pokemon/${id}`);
        if (!response.ok) throw new Error("Pokémon não encontrado");

        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <h1 className="load_screen">Carregando...</h1>;
  if (!pokemon) return <h1 className="load_screen">Pokémon não encontrado</h1>;

  return (
    <div>
      <header className="main_header">
        <Image src="/images/pokeinfo.png" width={220} height={60} alt="logo" />
      </header>

      <header className="second_header">
        <a href="/" className="back_link">← Voltar</a>
      </header>
      <div className="pokemon_details">
        <h1>{pokemon.name.toUpperCase()}</h1>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} className="pokemon_image" />
        <div className="details_screen">
          <p><strong>Tipos:</strong> {pokemon.types.map(t => t.type.name).join(", ")}</p>
          <p><strong>Habilidades:</strong> {pokemon.abilities.map(a => a.ability.name).join(", ")}</p>
          <p><strong>Altura:</strong> {pokemon.height / 10} metros</p>
          <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
        </div>
      </div>
    </div>
  );
}
