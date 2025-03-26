import style from "./Footer.module.scss";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={style.rodape}>
      <div className={style.rodape__conteudo}>
        <div className={style.rodape__conteudo__brand}>
          <div className={style.rodape__conteudo__brand__logo}>
            <span className={style.rodape__conteudo__brand__logo_icon}>
              <i className="ri-film-fill" />
            </span>
          </div>
          <div className={style.rodape__conteudo__brand__creditos}>
            <p>FEITO</p>
            <p>POR LUCAS BARROS SIMON</p>
          </div>
        </div>

        <div className={style.rodape__conteudo__social}>
          <a
            href="#"
            className={style.rodape__conteudo__social_link}
            aria-label="GitHub"
          >
            <i className="ri-github-fill" />
          </a>
          <a
            href="#"
            className={style.rodape__conteudo__social_link}
            aria-label="LinkedIn"
          >
            <i className="ri-linkedin-box-fill" />
          </a>
          <a
            href="#"
            className={style.rodape__conteudo__social_link}
            aria-label="Instagram"
          >
            <i className="ri-instagram-fill" />
          </a>
        </div>

        <div className={style.rodape__conteudo__info}>
          <p className={style.rodape__conteudo__info__copyright}>
            © {currentYear} <span>CINEMA DATABASE</span>
          </p>
          <p className={style.rodape__conteudo__info__copyright}>
            SELECIONANDO A EXCELÊNCIA
          </p>
        </div>
      </div>
    </footer>
  );
}
