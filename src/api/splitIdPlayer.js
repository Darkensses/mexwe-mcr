export function splitIdPlayer(id) {
  if (!id) return;
  const splitted = id.split("");
  return (
    splitted[0] +
    splitted[1] +
    splitted[2] +
    "/" +
    splitted[3] +
    splitted[4] +
    splitted[5]
  );
}
