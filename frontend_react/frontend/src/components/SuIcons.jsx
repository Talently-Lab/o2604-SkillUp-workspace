// src/components/SuIcons.jsx
// Iconos de Marina - Guia Estados y Alertas - SkillUp Campus
// 24px, trazo 2px, extremos redondeados, currentColor
// Uso: import { IconExito, IconError } from "../components/SuIcons";

export function IconExito() {
  return (
    <svg className="su-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.7 2.7L16.5 9" />
    </svg>
  );
}

export function IconError() {
  return (
    <svg className="su-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6m0-6-6 6" />
    </svg>
  );
}

export function IconAdvertencia() {
  return (
    <svg className="su-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.3 4.5 2.8 18a1.3 1.3 0 0 0 1.1 2h16.2a1.3 1.3 0 0 0 1.1-2L13.7 4.5a1.95 1.95 0 0 0-3.4 0Z" />
      <path d="M12 9v4m0 3v.1" />
    </svg>
  );
}

export function IconInformacion() {
  return (
    <svg className="su-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10v.1" />
    </svg>
  );
}

export function IconCargando() {
  return (
    <svg className="su-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

export function IconSinConexion() {
  return (
    <svg className="su-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 3 18 18M2.5 8a15 15 0 0 1 2-1.4M8 5.3A15 15 0 0 1 21.5 8M6 12a9 9 0 0 1 3.5-2M14.5 10a9 9 0 0 1 3.5 2m-9 4a4.2 4.2 0 0 1 6 0m-3 4v.1" />
    </svg>
  );
}

// Spinner de marca - 48px, ciclo 1,2s - Guia Estados y Alertas pag. 4
// Uso: <SuSpinner /> dentro de un boton o en pantalla de carga
export function SuSpinner() {
  return (
    <svg className="su-spinner" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle className="track" cx="24" cy="24" r="20" fill="none" />
      <circle className="rotor" cx="24" cy="24" r="20" fill="none" />
    </svg>
	);
}