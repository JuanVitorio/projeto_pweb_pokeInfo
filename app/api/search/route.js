// app/api/search/route.js (ou pages/api/search.js)
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";

  if (!search) {
    return NextResponse.json([]);
  }

  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
    const data = await response.json();

    // Filtra os resultados com base no nome do Pokémon
    const filtered = data.results.filter((p) =>
      p.name.includes(search)
    );

    // Adiciona detalhes dos Pokémon
    const detailedSuggestions = await Promise.all(
      filtered.slice(0, 5).map(async (p) => {
        const res = await fetch(p.url);
        if (!res.ok) return null;
        const details = await res.json();
        return { name: p.name, id: details.id, sprite: details.sprites.front_default };
      })
    );

    return NextResponse.json(detailedSuggestions.filter(Boolean)); // Retorna as sugestões filtradas
  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
    return NextResponse.json({ error: "Erro ao buscar Pokémon" }, { status: 500 });
  }
}
