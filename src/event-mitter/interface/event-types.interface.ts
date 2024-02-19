export interface EventPayloads {
  'user.verifyEmail': { name: string; email: string, link: string },
  'user.changePassword': {name: string, email: string, link: string},
  'user.forgotPassword': {name: string, email: string, link: string},
}