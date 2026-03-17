export const sortItems = <T extends { position: number | null }>(data: T[]) =>
  [...data].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
