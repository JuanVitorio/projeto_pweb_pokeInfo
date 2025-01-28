// app/api/pokemon/route.js (ou pages/api/pokemon.js)
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const offset = searchParams.get("offset") || 0;
  const limit = 20;

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await response.json();
    return NextResponse.json(data.results);
  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
    return NextResponse.json({ error: "Erro ao buscar Pokémon" }, { status: 500 });
  }
}
