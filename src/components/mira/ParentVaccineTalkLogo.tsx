type Props = { className?: string; title?: string };

/** Parent Vaccine Talk mark — identical to the chat app (chat.parentvaccinetalk.org). */
export function ParentVaccineTalkLogo({ className = "h-8 w-auto", title = "Parent Vaccine Talk" }: Props) {
  return (
    <svg viewBox="0 0 44 36" className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <path
        fill="var(--logo-primary)"
        d="M10 2h24a8 8 0 0 1 8 8v13a8 8 0 0 1-8 8H16l-8 4v-4a8 8 0 0 1-6-8V10a8 8 0 0 1 8-8Z"
      />
      <path fill="var(--logo-accent)" d="M22 24 14.8 17a4.6 4.6 0 0 1 7.2-5.7 4.6 4.6 0 0 1 7.2 5.7Z" />
    </svg>
  );
}
