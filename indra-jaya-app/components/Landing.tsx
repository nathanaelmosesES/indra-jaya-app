'use client'

import { useReveal } from '../lib/useReveal'
import './Landing.css'

// Assets live in /public/assets and are referenced by URL (host-agnostic).
const sm05 = '/assets/sm-05.webp'
const sm08 = '/assets/sm-08.webp'
const sm10 = '/assets/sm-10.webp'
const sm40 = '/assets/sm-40.webp'
const catHarness = '/assets/cat-harness.webp'
const catBoxtools = '/assets/cat-boxtools.webp'
const catTools = '/assets/cat-tools.webp'
const catCompass = '/assets/cat-compass.webp'
const catSafety = '/assets/cat-safety.webp'

/* --- contact -------------------------------------------------------------- */

const WA_NUMBER = '628118998098'
const WA_DISPLAY = '+62 811-8998-098'
const ADDRESS =
  'Plaza Kenari Mas, Jl. Kramat Raya No.101 Lt. 2 H26, Paseban, Kec. Senen, Jakarta Pusat, DKI Jakarta 10440'
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Plaza+Kenari+Mas+Jl+Kramat+Raya+No+101+Jakarta+Pusat'

const wa = (message: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`

/* --- data ----------------------------------------------------------------- */

type Product = {
  code: string
  img: string
  was: string
  now: string
  capacity: string
  coverage: string
  life: string
  composition: string
  featured?: boolean
}

const PRODUCTS: Product[] = [
  {
    code: 'SM-05',
    img: sm05,
    was: 'Rp1.058.000',
    now: 'Rp899.999',
    capacity: '500 gram',
    coverage: '1 m³',
    life: '3 tahun',
    composition: 'Powder & Aerosol',
    featured: true,
  },
  {
    code: 'SM-08',
    img: sm08,
    was: 'Rp628.000',
    now: 'Rp489.999',
    capacity: '800 ml',
    coverage: '1 m²',
    life: '3 tahun',
    composition: 'Foam',
  },
  {
    code: 'SM-10',
    img: sm10,
    was: 'Rp728.000',
    now: 'Rp569.999',
    capacity: '1 liter',
    coverage: '2 m²',
    life: '3 tahun',
    composition: 'Foam',
  },
  {
    code: 'SM-40',
    img: sm40,
    was: 'Rp1.358.000',
    now: 'Rp1.099.000',
    capacity: '4 liter',
    coverage: '7 m²',
    life: '3 tahun',
    composition: 'Foam',
  },
]

const CATEGORIES = [
  { name: 'Pemadam Api', note: 'SUMATO Smart Extinguisher', img: sm10 },
  { name: 'Body Harness', note: 'Pelindung kerja ketinggian', img: catHarness },
  { name: 'Box Tools', note: 'Kotak perkakas baja', img: catBoxtools },
  { name: 'Perkakas', note: 'Kunci & tools presisi', img: catTools },
  { name: 'Kompas', note: 'Navigasi lapangan', img: catCompass },
  { name: 'Safety Tools', note: 'Rompi & alat pengaman', img: catSafety },
]

const FEATURES = [
  {
    k: '5 detik',
    t: 'Padam total, cepat',
    d: 'Bereaksi terhadap titik api dan memadamkannya hingga mati total dalam lima detik.',
  },
  {
    k: 'Otomatis',
    t: 'Tanpa tenaga manusia',
    d: 'Bekerja sendiri saat mendeteksi api, tidak perlu ditarik, disemprot, atau dijaga.',
  },
  {
    k: 'Sertifikat',
    t: 'Nasional & internasional',
    d: 'Telah lulus pengujian dan bersertifikat standar nasional maupun internasional.',
  },
  {
    k: '3 tahun',
    t: 'Masa pakai panjang',
    d: 'Sekali pasang, terlindungi bertahun-tahun tanpa perawatan yang merepotkan.',
  },
]

const TRUST = [
  { icon: 'truck', t: 'Gratis Ongkir', d: 'Untuk wilayah Jakarta' },
  { icon: 'tag', t: 'Harga Terbaik', d: 'Langsung dari distributor' },
  { icon: 'headset', t: 'Dukungan 24/7', d: 'Dibantu sampai paham' },
  { icon: 'badge', t: 'Produk Original', d: 'Terjamin asli pabrik' },
]

/* --- icons (inline, no dependency) ---------------------------------------- */

function Icon({ name, className }: { name: string; className?: string }) {
  const common = {
    className,
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'whatsapp':
      return (
        <svg className={className} width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6 1.9.8 2.7.9 3.6.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.4Z" />
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18.3c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-2.8.8.8-2.8-.2-.3A8.3 8.3 0 1 1 12 20.3Z" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )
    case 'truck':
      return (
        <svg {...common}>
          <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7M6.5 18.5A1.5 1.5 0 1 0 6.5 15.5a1.5 1.5 0 0 0 0 3ZM17.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        </svg>
      )
    case 'tag':
      return (
        <svg {...common}>
          <path d="M20.5 13.5 13 21l-9-9V4h8l8.5 8.5a1.4 1.4 0 0 1 0 1ZM7.5 8.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
        </svg>
      )
    case 'headset':
      return (
        <svg {...common}>
          <path d="M4 13v-1a8 8 0 0 1 16 0v1M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 1ZM20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 1ZM17 18a4 4 0 0 1-4 3h-1" />
        </svg>
      )
    case 'badge':
      return (
        <svg {...common}>
          <path d="m12 3 2.5 1.8 3-.2.9 2.9 2.4 1.8-1.1 2.8 1.1 2.8-2.4 1.8-.9 2.9-3-.2L12 21l-2.5-1.8-3 .2-.9-2.9L3.2 15l1.1-2.8L3.2 9.4l2.4-1.8.9-2.9 3 .2L12 3ZM9 12l2 2 4-4" />
        </svg>
      )
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 3c1 4-3 5-3 9a3 3 0 0 0 6 0c0-1-.5-2-1-2.5.3 1.2-.3 2-1 2 .5-3-1-4-1-8.5Z" />
        </svg>
      )
    case 'pin':
      return (
        <svg {...common}>
          <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10ZM12 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        </svg>
      )
    default:
      return null
  }
}

/* --- sections ------------------------------------------------------------- */

function Header() {
  return (
    <header className="site-header">
      <div className="shell site-header__row">
        <a href="#top" className="wordmark" aria-label="Indra Jaya, beranda">
          <span className="wordmark__mark" aria-hidden="true">IJ</span>
          <span className="wordmark__text">
            Indra Jaya<em>Kenari Mas</em>
          </span>
        </a>
        <nav className="site-nav" aria-label="Navigasi utama">
          <a href="#produk">Produk</a>
          <a href="#keunggulan">Keunggulan</a>
          <a href="#kategori">Kategori</a>
          <a href="#kontak">Kontak</a>
        </nav>
        <a
          className="btn btn--red site-header__cta"
          href={wa('Halo Indra Jaya, saya ingin bertanya tentang produk SUMATO.')}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="whatsapp" />
          <span>Chat kami</span>
        </a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="shell hero__grid">
        <div className="hero__copy">
          <span className="eyebrow reveal">Alat Pemadam Api Cerdas</span>
          <h1 className="hero__title reveal">
            Padamkan api dalam <span className="hl">5&nbsp;detik.</span>
          </h1>
          <p className="hero__lead reveal">
            SUMATO bekerja otomatis tanpa bantuan manusia. Ia bereaksi ke titik
            api dan memadamkannya hingga mati total. Bersertifikat nasional dan
            internasional.
          </p>
          <div className="hero__actions reveal">
            <a
              className="btn btn--red"
              href={wa('Halo Indra Jaya, saya tertarik dengan SUMATO. Boleh info lengkapnya?')}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" />
              Chat via WhatsApp
            </a>
            <a className="btn btn--ghost" href="#produk">
              Lihat produk
              <Icon name="arrow" />
            </a>
          </div>
          <dl className="hero__stats reveal" data-reveal-stagger="90">
            <div className="reveal">
              <dt>5 detik</dt>
              <dd>api padam total</dd>
            </div>
            <div className="reveal">
              <dt>Otomatis</dt>
              <dd>tanpa operator</dd>
            </div>
            <div className="reveal">
              <dt>3 tahun</dt>
              <dd>masa pakai</dd>
            </div>
          </dl>
        </div>

        <div className="hero__stage reveal">
          <div className="hero__block" aria-hidden="true" />
          <img
            className="hero__product"
            src={sm10}
            width={520}
            height={520}
            alt="Tabung pemadam api cerdas SUMATO SM-10"
          />
          <div className="hero__chip">
            <Icon name="flame" />
            <span>Reaksi otomatis ke titik api</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Products() {
  return (
    <section className="section products" id="produk">
      <div className="shell">
        <div className="section__head">
          <span className="eyebrow reveal">Lini SUMATO</span>
          <h2 className="reveal">Satu tabung, empat ukuran perlindungan.</h2>
          <p className="section__intro reveal">
            Pilih kapasitas sesuai ruang yang ingin dilindungi, dari panel
            listrik kecil hingga area kerja yang lebih luas.
          </p>
        </div>

        <div className="product-grid" data-reveal-stagger="70">
          {PRODUCTS.map((p) => (
            <article className="product reveal" key={p.code}>
              {p.featured && <span className="product__flag">Terlaris</span>}
              <div className="product__media">
                <img src={p.img} width={260} height={260} alt={`SUMATO ${p.code}`} loading="lazy" />
              </div>
              <h3 className="product__code">SUMATO {p.code}</h3>
              <div className="product__price">
                <span className="product__was">{p.was}</span>
                <span className="product__now">{p.now}</span>
              </div>
              <dl className="product__specs">
                <div><dt>Kapasitas</dt><dd>{p.capacity}</dd></div>
                <div><dt>Luas pemadaman</dt><dd>{p.coverage}</dd></div>
                <div><dt>Masa pakai</dt><dd>{p.life}</dd></div>
                <div><dt>Komposisi</dt><dd>{p.composition}</dd></div>
              </dl>
              <a
                className="btn btn--red product__cta"
                href={wa(`Halo Indra Jaya, saya ingin pesan SUMATO ${p.code} (${p.now}).`)}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" />
                Pesan {p.code}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="section features" id="keunggulan">
      <div className="shell">
        <div className="section__head">
          <span className="eyebrow reveal">Kenapa SUMATO</span>
          <h2 className="reveal">Perlindungan yang bekerja saat Anda tidak sempat bereaksi.</h2>
        </div>
        <div className="feature-grid" data-reveal-stagger="80">
          {FEATURES.map((f) => (
            <div className="feature reveal" key={f.k}>
              <span className="feature__k">{f.k}</span>
              <h3 className="feature__t">{f.t}</h3>
              <p className="feature__d">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className="section categories" id="kategori">
      <div className="shell">
        <div className="section__head">
          <span className="eyebrow reveal">Indra Jaya Shop</span>
          <h2 className="reveal">Bukan hanya pemadam api.</h2>
          <p className="section__intro reveal">
            Perlengkapan keselamatan dan perkakas kerja, dilengkapi untuk
            kebutuhan industri maupun lapangan.
          </p>
        </div>
        <div className="cat-grid" data-reveal-stagger="60">
          {CATEGORIES.map((c) => (
            <a
              className="cat reveal"
              key={c.name}
              href={wa(`Halo Indra Jaya, saya ingin lihat koleksi ${c.name}.`)}
              target="_blank"
              rel="noreferrer"
            >
              <div className="cat__media">
                <img src={c.img} alt={c.name} loading="lazy" />
              </div>
              <div className="cat__foot">
                <div>
                  <h3 className="cat__name">{c.name}</h3>
                  <p className="cat__note">{c.note}</p>
                </div>
                <span className="cat__arrow" aria-hidden="true">
                  <Icon name="arrow" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function Trust() {
  return (
    <section className="section trust">
      <div className="shell trust__grid" data-reveal-stagger="70">
        {TRUST.map((t) => (
          <div className="trust__item reveal" key={t.t}>
            <span className="trust__icon"><Icon name={t.icon} /></span>
            <div>
              <h3 className="trust__t">{t.t}</h3>
              <p className="trust__d">{t.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="section contact" id="kontak">
      <div className="shell contact__grid">
        <div className="contact__copy reveal">
          <span className="eyebrow">Kontak</span>
          <h2 className="contact__title">
            Butuh saran unit yang tepat? Kami bantu pilihkan.
          </h2>
          <p className="contact__lead">
            Ceritakan ruang atau area yang ingin dilindungi, dan tim kami akan
            merekomendasikan SUMATO yang sesuai serta mengurus pengirimannya.
          </p>
          <div className="contact__actions">
            <a
              className="btn btn--red"
              href={wa('Halo Indra Jaya, saya ingin konsultasi pemilihan unit SUMATO.')}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" />
              {WA_DISPLAY}
            </a>
            <a className="btn btn--ghost" href={MAPS_URL} target="_blank" rel="noreferrer">
              <Icon name="pin" />
              Buka di Maps
            </a>
          </div>
        </div>
        <address className="contact__card reveal">
          <span className="contact__label">Toko</span>
          <p className="contact__store">Indra Jaya Kenari Mas</p>
          <p className="contact__addr">{ADDRESS}</p>
        </address>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div className="footer__brand">
          <span className="wordmark wordmark--light">
            <span className="wordmark__mark" aria-hidden="true">IJ</span>
            <span className="wordmark__text">
              Indra Jaya<em>Kenari Mas</em>
            </span>
          </span>
          <p className="footer__blurb">
            Distributor SUMATO Smart Fire Extinguisher dan perlengkapan
            keselamatan kerja di Jakarta.
          </p>
        </div>
        <nav className="footer__links" aria-label="Tautan footer">
          <span className="footer__h">Menu</span>
          <a href="#top">Beranda</a>
          <a href="#produk">Produk</a>
          <a href="#kategori">Kategori</a>
          <a href="#kontak">Kontak</a>
        </nav>
        <div className="footer__contact">
          <span className="footer__h">Hubungi</span>
          <a href={wa('Halo Indra Jaya.')} target="_blank" rel="noreferrer">
            WhatsApp {WA_DISPLAY}
          </a>
          <a href={MAPS_URL} target="_blank" rel="noreferrer">
            {ADDRESS}
          </a>
        </div>
      </div>
      <div className="shell footer__base">
        <span>© {new Date().getFullYear()} Indra Jaya Kenari Mas</span>
        <span>SUMATO · Smart Fire Extinguisher</span>
      </div>
    </footer>
  )
}

function FloatingWhatsApp() {
  return (
    <a
      className="fab"
      href={wa('Halo Indra Jaya, saya ingin bertanya tentang produk.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat via WhatsApp"
    >
      <Icon name="whatsapp" />
      <span>Chat kami</span>
    </a>
  )
}

function Landing() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref}>
      <Header />
      <main>
        <Hero />
        <Products />
        <Features />
        <Categories />
        <Trust />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

export default Landing
