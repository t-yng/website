import { css } from "@/styled-system/css";

type Props = {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
};

export const SocialLink = ({ href, ariaLabel, children }: Props) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={css({
        color: "token(colors.secondary)",
        _hover: { color: "token(colors.text)" },
        transition: "color 0.2s",
      })}
    >
      {children}
    </a>
  );
};
