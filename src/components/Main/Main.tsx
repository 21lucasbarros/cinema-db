import { useState } from "react";
import style from "./Main.module.scss";
import axios from "axios";

interface Provider {
  provider_name: string;
  logo_path: string;
}

interface Movie {
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  id: number;
  genres: string[];
  director: string;
  providers?: Provider[];
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

      // Busca os detalhes do filme (incluindo equipe técnica)
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

      // Busca informações de onde assistir
      const providersResponse = await axios.get(
        `${movieDetailsUrl}/${filmeMaisPopular.id}/watch/providers`,
        {
          params: {
            api_key: apiKey,
          },
        }
      );

      const detalhes = detalhesResponse.data;
      const diretor =
        detalhes.credits.crew.find((pessoa: any) => pessoa.job === "Director")
          ?.name || "Desconhecido";

      // Processa os provedores de streaming no Brasil
      const providersBR = providersResponse.data.results?.BR?.flatrate || [];
      const providers = providersBR.map((provider: any) => ({
        provider_name: provider.provider_name,
        logo_path: provider.logo_path,
      }));

      // Cria o objeto final do filme com todas as informações
      const filmeFinal = {
        ...filmeMaisPopular,
        genres: detalhes.genres.map((g: any) => g.name),
        director: diretor,
        providers: providers,
      };

      setResultados([filmeFinal]);
    } catch (error) {
      setErro("Ocorreu um erro na busca.");
      console.error(error);

      // Caso queira mostrar o erro específico para o usuário (opcional)
      if (axios.isAxiosError(error)) {
        console.error("Detalhes do erro:", error.response?.data);
      }
    }
  };
  return (
    <>
      <main className={style.principal}>
        <div className={style.principal__conteudo}>
          <h1 className={style.principal__conteudo__titulo}>
            <span>"CINEMA"</span>
            <span>DATABASE™</span>
          </h1>
          <div className={style.principal__conteudo__inputs}>
            <input
              type="text"
              placeholder="Digite o nome de um filme"
              value={campoPesquisa}
              onChange={(e) => setCampoPesquisa(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  pesquisar();
                }
              }}
              className={style.principal__conteudo__inputs__text}
            />
            <button
              onClick={pesquisar}
              className={style.principal__conteudo__inputs__button}
            >
              Pesquisar
            </button>
          </div>

          <div className={style.resultados__conteudo__pesquisa}>
            {erro && (
              <p className={style.resultados__conteudo__pesquisa__erro}>
                {erro}
              </p>
            )}
            {resultados.map((filme) => (
              <div
                key={filme.id}
                className={style.resultados__conteudo__pesquisa__item}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                  alt={filme.title}
                  className={style.resultados__conteudo__pesquisa__item__img}
                />
                <div>
                  <h2
                    className={
                      style.resultados__conteudo__pesquisa__item__titulo
                    }
                  >
                    {filme.title}
                  </h2>
                  <p
                    className={
                      style.resultados__conteudo__pesquisa__item__descricao
                    }
                  >
                    {filme.overview}
                  </p>
                  <p
                    className={style.resultados__conteudo__pesquisa__item__data}
                  >
                    <strong>Data de lançamento:</strong> {filme.release_date}
                  </p>
                  <p
                    className={
                      style.resultados__conteudo__pesquisa__item__genero
                    }
                  >
                    <strong>Gênero:</strong> {filme.genres?.join(", ")}
                  </p>
                  <p
                    className={
                      style.resultados__conteudo__pesquisa__item__diretor
                    }
                  >
                    <strong>Diretor:</strong> {filme.director}
                  </p>

                  {filme.providers && filme.providers.length > 0 ? (
                    <div
                      className={
                        style.resultados__conteudo__pesquisa__item__providers
                      }
                    >
                      <strong>Disponível em:</strong>
                      <div className={style.providersList}>
                        {filme.providers.map((provider, index) => (
                          <div key={index} className={style.provider}>
                            <img
                              src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                              alt={provider.provider_name}
                              title={provider.provider_name}
                            />
                            <span>{provider.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p
                      className={
                        style.resultados__conteudo__pesquisa__item__noProviders
                      }
                    >
                      Não encontramos informações sobre onde assistir este filme
                      no Brasil.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
