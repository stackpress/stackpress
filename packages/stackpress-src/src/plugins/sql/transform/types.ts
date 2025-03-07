export type Relations = Record<string, {
  localTable: string,
  localId: string,
  foreignTable: string,
  foreignId: string
}>;