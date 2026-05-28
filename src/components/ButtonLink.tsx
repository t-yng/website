import Link from "next/link";
import { css } from "@/styled-system/css";

type Variant = "primary" | "outline";

type Props = {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
};

const variantStyles: Record<Variant, Parameters<typeof css>[0]> = {
  primary: {
    backgroundColor: "token(colors.buttonBg)",
    color: "token(colors.buttonText)",
    _hover: { opacity: 0.85 },
    transition: "opacity 0.2s",
  },
  outline: {
    border: "1.5px solid token(colors.border)",
    color: "token(colors.text)",
    _hover: {
      borderColor: "token(colors.text)",
      backgroundColor: "token(colors.surface)",
    },
    transition: "border-color 0.2s, background-color 0.2s",
  },
};

export const ButtonLink = ({ href, variant = "primary", children }: Props) => {
  return (
    <Link
      href={href}
      className={css({
        display: "inline-flex",
        alignItems: "center",
        px: "6",
        py: "3",
        borderRadius: "md",
        fontSize: "sm",
        fontWeight: "600",
        cursor: "pointer",
        ...variantStyles[variant],
      })}
    >
      {children}
    </Link>
  );
};
