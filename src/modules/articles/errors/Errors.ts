const ERRORS = {
  '23505': 'Duplicate fields found',
  '404': 'Not found',
  '10050': 'Incorrect username or password',
};

export function getError(code: string) {
  return ERRORS[code];
}
