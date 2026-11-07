/** @type {import('next').NextConfig} */
const nextConfig = {
  // Served inside the main site: acessousa.com/score (the website proxies it).
  basePath: '/score',
  // Old links (acesso-usa-score.vercel.app/..., invites already sent) keep working.
  async redirects() {
    return [
      { source: '/', destination: '/score', basePath: false, permanent: false },
      { source: '/quiz', destination: '/score/quiz', basePath: false, permanent: false },
      { source: '/resultado', destination: '/score/resultado', basePath: false, permanent: false },
      { source: '/admin', destination: '/score/admin', basePath: false, permanent: false },
      { source: '/convite-black', destination: '/score/convite-black', basePath: false, permanent: false },
    ]
  },
}
module.exports = nextConfig
