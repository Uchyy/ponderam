
export interface AuthRepository {
  signInWithGoogle(returnTo: string): Promise<void>;

  signInWithMagicLink(
    email: string,
    returnTo: string
  ): Promise<void>;

  signOut(): Promise<void>;
}
