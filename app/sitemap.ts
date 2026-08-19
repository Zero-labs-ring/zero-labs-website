import { MetadataRoute } from 'next'

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'https://www.zerolabs.live'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()

  const routes = [
    '',
    '/chat',
    '/docs',
    '/api-platform',
    '/research',
    '/cowork',
    '/status',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))
}

