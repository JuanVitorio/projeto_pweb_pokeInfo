"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from 'next/head';

export default function PokemonList() {
  const [pokemons, setPokemons] = useState([]); // Lista de Pokémon
  const [offset, setOffset] = useState(0); // Controle da paginação
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [isClient, setIsClient] = useState(false); // Verifica se está no cliente
  const observerRef = useRef(null); // Referência para o scroll infinito

  // Função para buscar os Pokémon
  async function fetchPokemons() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/pokemon?offset=${offset}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setPokemons((prev) => [...prev, ...data]); // Adiciona novos Pokémon à lista
    } catch (error) {
      console.error("Erro ao carregar Pokémon:", error);
    } finally {
      setLoading(false);
    }
  }

  // Carrega Pokémon ao iniciar a página e ao alterar o offset
  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  // Configuração do Observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setOffset((prev) => prev + 20);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading]);

  // Marca a renderização no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Se estamos no servidor, não renderize os dados
  if (!isClient) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Head>
        <title>PokeInfos</title>
        <meta name="description" content="Veja todos os Pokémons disponíveis" />
      </Head>
      <div className="main_header">
        <Image 
          src="/images/pokelisttagem.png" 
          width={220} 
          height={60} 
          alt="Lista de Pokémons" 
        />
      </div>
      <div className="second_header">
        <a href="/" className="back_link">← Voltar</a>
      </div>
      <div className="grey_box">
        <div className="white_box">
          {pokemons.length > 0 ? (
            pokemons.map((p, index) => {
              // Extraindo o ID real da URL da API
              const pokemonId = p.url.split("/").slice(-2, -1)[0];

              // Garantir chave única (usando o pokemonId + índice como chave)
              const uniqueKey = `${pokemonId}-${index}`;

              return (
                <Link 
                  href={`/pokemon/${pokemonId}`} 
                  key={uniqueKey} // Garantindo que a chave seja única
                  className="pokemon_box"
                >
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                    alt={`Imagem do Pokémon ${p.name}`} // Alt mais descritivo
                    className="pokemon_image_screen"
                    width={100} // Definir tamanho correto
                    height={100} // Definir tamanho correto
                  />
                  <span className="pokemon_name">{p.name}</span>
                </Link>
              );
            })
          ) : (
            <p className="loading">Carregando Pokémon...</p>
          )}

          {/* Ponto de referência para carregar mais */}
          <div ref={observerRef} style={{ height: 20 }}></div>

          {loading && <p className="loading">Carregando mais Pokémon...</p>}
        </div>
      </div>
    </div>
  );
}
