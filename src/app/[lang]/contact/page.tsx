"use client";

import { useState } from "react";
import { css, cx } from "@/styled-system/css";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com",
    description: "See my open-source work",
    icon: <GitHubIcon size={20} />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    description: "Connect professionally",
    icon: <LinkedInIcon size={20} />,
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
