export const unixTransformer = {
  to: () => Date.now(),
  from: (value: number) => value,
};
