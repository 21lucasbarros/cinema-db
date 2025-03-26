import style from "./Header.module.scss";

export default function Header() {
  return (
    <>
      <header className={style.cabecalho}>
        <div className={style.cabecalho__conteudo}>
          <div className={style.cabecalho__conteudo__brand}>
            <div className={style.cabecalho__conteudo__brand__logo}>
              <i className="ri-film-fill" />
            </div>
            <div className={style.cabecalho__conteudo__brand__titulo}>
              <span className={style.cabecalho__conteudo__brand__titulo_main}>
                CINEMA
              </span>
              <span className={style.cabecalho__conteudo__brand__titulo_sub}>
                DATABASE
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
