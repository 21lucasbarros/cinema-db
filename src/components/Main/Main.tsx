import { useState } from "react";
import style from "./Main.module.scss";
import axios from "axios";

interface Movie {
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  id: number;
  genres: string[];
  director: string;
}

export default function Main() {
  const [campoPesquisa, setCampoPesquisa] = useState<string>("");
  const [resultados, setResultados] = useState<Movie[]>([]);
  const [erro, setErro] = useState<string>("");

  const apiKey = import.meta.env.VITE_API_KEY;
  const apiUrl = "https://api.themoviedb.org/3/search/movie";
  const movieDetailsUrl = "https://api.themoviedb.org/3/movie";

  const pesquisar = async () => {
    if (!campoPesquisa) {
      setErro("Você precisa digitar o nome do filme.");
      return;
    }

    setErro("");
    setResultados([]);

    try {
      const response = await axios.get(apiUrl, {
        params: {
          api_key: apiKey,
          query: campoPesquisa,
          language: "pt-BR",
        },
      });

      let filmes = response.data.results;

      if (filmes.length === 0) {
        setErro("Nenhum filme encontrado.");
        return;
      }

      filmes = filmes.filter(
        (filme: any) =>
          filme.title.toLowerCase() === campoPesquisa.toLowerCase()
      );

      if (filmes.length === 0) {
        setErro("Nenhum filme encontrado com esse título exato.");
        return;
      }

      filmes.sort((a: any, b: any) => b.popularity - a.popularity);

      const filmeMaisPopular = filmes[0];

      const detalhesResponse = await axios.get(
        `${movieDetailsUrl}/${filmeMaisPopular.id}`,
        {
          params: {
            api_key: apiKey,
            language: "pt-BR",
            append_to_response: "credits",
          },
        }
      );

      const detalhes = detalhesResponse.data;
      const diretor =
        detalhes.credits.crew.find((pessoa: any) => pessoa.job === "Director")
          ?.name || "Desconhecido";

      const filmeFinal = {
        ...filmeMaisPopular,
        genres: detalhes.genres.map((g: any) => g.name),
        director: diretor,
      };

      setResultados([filmeFinal]);
    } catch (error) {
      setErro("Ocorreu um erro na busca.");
      console.error(error);
    }
  };
  return (
    <>
      <main className={style.principal}>
        <div className={style.principal__inputs}>
          <input
            type="text"
            placeholder="Digite o nome de um filme"
            value={campoPesquisa}
            onChange={(e) => setCampoPesquisa(e.target.value)}
            className={style.principal__inputs__text}
          />
          <button
            onClick={pesquisar}
            className={style.principal__inputs__button}
          >
            Pesquisar
          </button>
        </div>

        <div className={style.resultados__pesquisa}>
          {erro && <p className={style.resultados__pesquisa__erro}>{erro}</p>}
          {resultados.map((filme) => (
            <div key={filme.id} className={style.resultados__pesquisa__item}>
              <h2>{filme.title}</h2>
              <p className="descricao-meta">{filme.overview}</p>
              <p>Data de lançamento: {filme.release_date}</p>
              <p>
                <strong>Gênero:</strong> {filme.genres?.join(", ")}
              </p>
              <p>
                <strong>Diretor:</strong> {filme.director}
              </p>
              <img
                src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                alt={filme.title}
                style={{ width: "200px" }}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
