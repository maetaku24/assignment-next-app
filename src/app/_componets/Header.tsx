import Link from "next/link";
import classes from "../../styles/Header.module.css";

export const Header: React.FC = () => {
  return (
    <header className={classes.header}>
      <Link href="/" className={classes.headerLink}>
        BLOG
      </Link>
      <Link href="/contact" className={classes.headerLink}>
        お問い合わせ
      </Link>
    </header>
  );
};
