const ERRORS = {
  '23505': 'Duplicate fields found',
};

export function getError(code: string) {
  return ERRORS[code];
}
