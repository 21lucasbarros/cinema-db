import style from "./Footer.module.scss";

export default function Footer() {
  const anoAtual = new Date().getFullYear();
  return (
    <>
      <footer className={style.rodape}>
        <div className={style.rodape__conteudo}>
          <div className={style.rodape__conteudo__brand}>
            <img
              src="../../../../logo.svg"
              alt="Logo do Cinema Database"
              className={style.rodape__conteudo__brand__logo}
            />
            <span>Cinema Database</span>
          </div>

          <p className={style.rodape__conteudo__copyright}>
            &copy; {anoAtual} Cinema Database. Todos os direitos reservados.
          </p>

          <div className={style.rodape__conteudo__social}>
            <a href="#" aria-label="GitHub">
              <i className="ri-github-fill" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="ri-linkedin-box-fill" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
