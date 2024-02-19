
export interface RefreshPayload {
  sub: string
  email: string
  iat: number
  exp: number
  refreshToken: string
}