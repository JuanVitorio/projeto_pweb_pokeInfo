// app/api/pokemon/[id]/route.js (ou pages/api/pokemon/[id].js)
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) throw new Error("Pokémon não encontrado");

    const data = await response.json();
    return NextResponse.json(data); // Retorna os dados do Pokémon
  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
    return NextResponse.json({ error: "Pokémon não encontrado" }, { status: 404 });
  }
}
