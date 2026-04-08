"use client";

import { useId, useState } from "react";

type PasswordFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
};

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  autoComplete = "current-password",
  required = false,
  disabled = false,
  minLength,
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700"
        >
          {label}
        </label>

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="inline-flex items-center rounded-xl px-2 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-300/90 bg-white px-4 py-3.5 pr-24 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          minLength={minLength}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
          disabled={disabled}
          tabIndex={-1}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </div>
  );
}