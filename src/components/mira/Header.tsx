type Props = {
  current: number;
  total: number;
};

export function Header({ current, total }: Props) {
  return (
    <header className="mx-auto max-w-6xl px-6 pt-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dialogue Review
        </h1>
        <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
          Research preview
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Mira Dialogue Review System · Review Item {current} of {total}
      </p>
    </header>
  );
}
