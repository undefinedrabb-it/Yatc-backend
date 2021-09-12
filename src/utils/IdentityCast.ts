export const Identity =
  <fromType, toType>() =>
  (v: fromType) =>
    v as unknown as toType;
