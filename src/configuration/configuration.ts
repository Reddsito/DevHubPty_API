

export const ConfigVariables = () => ({
  port: process.env.PORT || 3333,
  host: process.env.HOST || 'localhost:3333',
  supabase: {
    host: process.env.SUPABASE_HOST || 'localhost',
    port: parseInt(process.env.SUPABASE_PORT || '5432', 10),
    name: process.env.SUPABASE_NAME || 'devhub',
    user: process.env.SUPABASE_USER || 'postgres',
    password: process.env.SUPABASE_PASSWORD || 'password'
  },
  jwt: {
    access_secret: 'example',
    refresh_secret: 'example2'
  },
  nodemailer: {
    service: process.env.NODEMAILER_SERVICE ,
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    user: process.env.NODEMAILER_USER,
    password: process.env.NODEMAILER_PASS
  }
});