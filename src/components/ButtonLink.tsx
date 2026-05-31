import Link from "next/link";
import { css, cx } from "@/styled-system/css";

type Props = {
  href: string;
  variant?: "primary" | "outline";
  size?: "xs" | "sm" | "md";
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
};

export const ButtonLink = ({
  href,
  variant = "primary",
  size = "md",
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
      className={cx(className, base, variantClasses[variant], sizeClasses[size])}
    >
      {children}
    </Link>
  );
};

const base = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "1.5",
  borderRadius: "md",
  fontWeight: "600",
  cursor: "pointer",
});

const variantClasses = {
  primary: css({
    backgroundColor: "token(colors.buttonBg)",
    color: "token(colors.buttonText)",
    _hover: { opacity: 0.85 },
    transition: "opacity 0.2s",
  }),
  outline: css({
    border: "1px solid token(colors.secondary)",
    color: "token(colors.text)",
    _hover: {
      borderColor: "token(colors.text)",
      backgroundColor: "token(colors.surface)",
    },
    transition: "border-color 0.2s, background-color 0.2s",
  }),
};

const sizeClasses = {
  xs: css({ px: "2", py: "1", fontSize: "xs" }),
  sm: css({ px: "3", py: "1.5", fontSize: "xs" }),
  md: css({ px: "6", py: "3", fontSize: "sm" }),
};
