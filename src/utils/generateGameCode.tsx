
const GAME_CODE_CHARACTERS =  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

type CodeExists = (code: string) => Promise<boolean>;

export async function generateGameCode(  codeExists?: CodeExists,): Promise<string> {
  let code: string;

  do {
    const values = crypto.getRandomValues(new Uint8Array(7));

    code = Array.from(
      values,
      (value) =>
        GAME_CODE_CHARACTERS[value % GAME_CODE_CHARACTERS.length],
    ).join("");
  } while (codeExists && (await codeExists(code)));

  return code;
}
