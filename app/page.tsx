import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="home_container">
      <header className="main_header">
        <Image 
          src="/images/pokeinfo.png" 
          width={220} 
          height={60} 
          alt="logo"
          priority 
        />
      </header>

      <header className="second_header">
        <div className="mini_box"></div>
      </header>

      <div className="box_main">
        <h1>Opções</h1>
        <div className="link_box">
          <Link href="/pokemon" className="link_a">
            Listar todos os Pokémons
          </Link>
          <Link href="/pokeSearch" className="link_a">
            Pesquisar Pokémon
          </Link>
        </div>
      </div>

      <footer>
        <p>Desenvolvido por Juan - Powered by PokéAPI</p>
      </footer>
    </div>
  );
}
