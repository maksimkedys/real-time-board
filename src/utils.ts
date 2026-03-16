export const sortItems = <T extends { position: number }>(data: T[]) =>
  [...data].sort((a, b) => a.position - b.position);
