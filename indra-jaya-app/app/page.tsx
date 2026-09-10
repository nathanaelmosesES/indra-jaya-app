import Landing from '../components/Landing'

// Landing is a client component (scroll-reveal + interactivity), but this page
// is a server component, so Next prerenders it to static HTML (great for SEO)
// and hydrates on the client.
export default function HomePage() {
  return <Landing />
}
