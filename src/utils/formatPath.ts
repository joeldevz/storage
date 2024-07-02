export function formatPath(path: string): string {
  // Elimina cualquier barra inicial
  path = path.replace(/^\//, '');

  // Reemplaza múltiples barras con una sola
  path = path.replace(/\/+/g, '/');

  // Asegura que no termina con una barra
  path = path.replace(/\/$/, '');

  return path;
}
