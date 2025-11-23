export const unixTransformer = {
  to: () => Math.floor(Date.now() / 1000),
  from: (value: number) => value,
};
