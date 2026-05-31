import Link from "next/link";
import { css, cx } from "@/styled-system/css";

type Props = {
  href: string;
  ariaLabel?: string;
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
};

export const IconLink = ({
  href,
  ariaLabel,
  target,
  rel,
  className,
  children,
}: Props) => {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={cx(className, iconLink)}
    >
      {children}
    </Link>
  );
};

const iconLink = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "token(colors.secondary)",
  _hover: { color: "token(colors.text)" },
  transition: "color 0.2s",
  cursor: "pointer",
});
