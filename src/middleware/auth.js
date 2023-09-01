export default function auth({ next, router }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (!isAuthenticated) {
    return router.push({ name: 'login' })
  }

  return next()
}
