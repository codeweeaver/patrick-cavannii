export function findInputError(errors, name) {
  if (!errors || !name) return {};
  const error = name.split('.').reduce((obj, key) => obj?.[key], errors);
  return error ? { error } : {};
}
