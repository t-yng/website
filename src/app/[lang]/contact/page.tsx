"use client";

import { useState } from "react";
import { css, cx } from "@/styled-system/css";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com",
    description: "See my open-source work",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    description: "Connect professionally",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const labelStyle = css({
    display: "block",
    fontSize: "sm",
    fontWeight: "500",
    color: "token(colors.text)",
    mb: "2",
  });

  const inputStyle = css({
    display: "block",
    width: "100%",
    px: "4",
    py: "3",
    border: "1.5px solid token(colors.border)",
    borderRadius: "md",
    fontSize: "base",
    color: "token(colors.text)",
    backgroundColor: "token(colors.surface)",
    outline: "none",
    _focus: {
      borderColor: "token(colors.accent)",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
    },
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  return (
    <div
      className={css({
        maxWidth: "token(sizes.container)",
        mx: "auto",
        px: { base: "6", md: "8" },
        py: { base: "16", md: "24" },
      })}
    >
      <h1
        className={css({
          fontFamily: "token(fonts.heading)",
          fontSize: { base: "2xl", md: "3xl" },
          fontWeight: "700",
          color: "token(colors.text)",
          letterSpacing: "-0.03em",
          mb: "4",
        })}
      >
        Get in Touch
      </h1>
      <div
        className={css({
          width: "40px",
          height: "3px",
          backgroundColor: "token(colors.accent)",
          borderRadius: "full",
          mb: "4",
        })}
      />
      <p
        className={css({
          fontSize: "lg",
          color: "token(colors.secondary)",
          mb: "12",
          maxWidth: "480px",
        })}
      >
        Have a project in mind or just want to say hello? I'd love to hear from you.
      </p>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "1fr 1fr" },
          gap: { base: "12", md: "16" },
          alignItems: "start",
        })}
      >
        {/* Form */}
        <div>
          {submitted ? (
            <div
              className={css({
                p: "6",
                border: "1px solid token(colors.border)",
                borderRadius: "lg",
                backgroundColor: "token(colors.surface)",
                textAlign: "center",
              })}
              role="status"
              aria-live="polite"
            >
              <p
                className={css({
                  fontFamily: "token(fonts.heading)",
                  fontSize: "xl",
                  fontWeight: "600",
                  color: "token(colors.text)",
                  mb: "2",
                })}
              >
                Message sent!
              </p>
              <p
                className={css({
                  fontSize: "base",
                  color: "token(colors.secondary)",
                })}
              >
                Thanks for reaching out. I'll get back to you soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={css({ display: "flex", flexDirection: "column", gap: "5" })}
              noValidate
            >
              <div>
                <label htmlFor="name" className={labelStyle}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelStyle}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="message" className={labelStyle}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or just say hi..."
                  className={cx(
                    inputStyle,
                    css({
                      resize: "vertical",
                      minHeight: "120px",
                    }),
                  )}
                />
              </div>

              <button
                type="submit"
                className={css({
                  px: "6",
                  py: "3",
                  backgroundColor: "token(colors.buttonBg)",
                  color: "token(colors.buttonText)",
                  borderRadius: "md",
                  fontSize: "sm",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: "none",
                  alignSelf: "flex-start",
                  _hover: { opacity: 0.85 },
                  transition: "opacity 0.2s",
                })}
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Socials */}
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "4",
          })}
        >
          <p
            className={css({
              fontSize: "sm",
              fontWeight: "600",
              color: "token(colors.muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              mb: "2",
            })}
          >
            Or find me on
          </p>

          {socials.map(({ label, href, description, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "4",
                p: "4",
                border: "1px solid token(colors.border)",
                borderRadius: "lg",
                backgroundColor: "token(colors.surface)",
                cursor: "pointer",
                _hover: {
                  borderColor: "token(colors.secondary)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                },
                transition: "border-color 0.2s, box-shadow 0.2s",
              })}
            >
              <span
                className={css({
                  color: "token(colors.secondary)",
                  flexShrink: 0,
                })}
              >
                {icon}
              </span>
              <div>
                <p
                  className={css({
                    fontSize: "sm",
                    fontWeight: "600",
                    color: "token(colors.text)",
                    mb: "0.5",
                  })}
                >
                  {label}
                </p>
                <p
                  className={css({
                    fontSize: "xs",
                    color: "token(colors.muted)",
                  })}
                >
                  {description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
