"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PokeSearch() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (search.length > 1) {
      // Chama a rota de pesquisa do servidor
      fetch(`/api/search?search=${search}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
            return;
          }
          setSuggestions(data); // Atualiza as sugestões com a resposta do servidor
        });
    } else {
      setSuggestions([]); // Limpa as sugestões se o campo de pesquisa estiver vazio
    }
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (search.trim() === "") return;

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
      if (!response.ok) {
        alert("Pokémon não encontrado! Tente outro nome.");
        return;
      }
      router.push(`/pokemon/${search.toLowerCase()}`);
    } catch (error) {
      alert("Erro ao buscar o Pokémon. Verifique sua conexão.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <header className="main_header">
        <Image src="/images/sear.png" width={220} height={60} alt="logo" />
      </header>
      <header className="second_header">
        <a href="/" className="back_link">← Voltar</a>
      </header>
      <div className="box_main">
        <h1 className="text-3xl font-bold mb-4">Pesquisar Pokémon</h1>
        <form onSubmit={handleSubmit} className="form_box">
          <input
            type="text"
            placeholder="Digite o nome do Pokémon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-lg shadow-sm"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">
            Pesquisar
          </button>
        </form>
        {suggestions.length > 0 && (
          <ul className="sugest_list">
            {suggestions.map((s) => (
              <li key={s.id} className="sugest_item" onClick={() => setSearch(s.name)}>
                <span className="text-lg font-medium">{s.name}</span>
                <Image src={s.sprite} alt={s.name} width={50} height={50} className="mr-4" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
