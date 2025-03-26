import style from "./Header.module.scss";

export default function Header() {
  return (
    <>
      <header className={style.cabecalho}>
        <div className={style.cabecalho__conteudo}>
          <i className="ri-film-fill" />
          <h1 className={style.cabecalho__conteudo__titulo}>Cinema Database</h1>
        </div>
      </header>
    </>
  );
}
