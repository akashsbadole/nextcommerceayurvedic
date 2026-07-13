import Link from 'next/link'
import { getFeaturedProducts, getBestsellers, getCategories, getPosts } from '@/lib/data'
import { ProductCard } from '@/components/store/ProductCard'
import { PostCard } from '@/components/store/PostCard'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featured, bestsellers, categories, posts] = await Promise.all([
    getFeaturedProducts(),
    getBestsellers(),
    getCategories(),
    getPosts(3),
  ])

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-bgalt">
        <div className="container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="eyebrow">Classical Ayurveda, modern rituals</div>
            <h1 className="mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Skin, hair &amp; wellness from the ancient texts
            </h1>
            <p className="mt-5 max-w-md text-lg text-inksoft">
              Handcrafted formulations using wild-harvested herbs — Kumkumadi,
              Bhringraj, Chyawanprash and more. Balanced for your dosha, delivered
              across India.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">Shop all formulations</Link>
              <Link href="/about" className="btn btn-outline">Our story</Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-inksoft">
              <div><strong className="block text-2xl font-serif text-ink">120+</strong>Products</div>
              <div><strong className="block text-2xl font-serif text-ink">2,000+</strong>Years of text</div>
              <div><strong className="block text-2xl font-serif text-ink">4.8★</strong>Avg rating</div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="mx-auto aspect-[4/5] w-80 rounded-l bg-paper shadow-vedika ring-1 ring-line">
              <div className="grid h-full place-items-center">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-widest text-green">Featured</div>
                  <div className="mt-2 font-serif text-2xl">Kumkumadi Glow Oil</div>
                  <div className="mt-1 text-sm text-inksoft">from {formatPrice(899)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="container py-14">
        <div className="mb-8 text-center">
          <div className="eyebrow">Shop by need</div>
          <h2 className="mt-2 text-3xl">Find your ritual</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="card group flex flex-col items-center gap-2 p-6 text-center transition hover:-translate-y-1 hover:border-green"
            >
              <span className="font-serif text-lg text-ink group-hover:text-green">{c.title}</span>
              <span className="text-xs text-inksoft">{c.tagline}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-bgalt/60 py-14">
        <div className="container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="eyebrow">Handpicked</div>
              <h2 className="mt-2 text-3xl">Featured formulations</h2>
            </div>
            <Link href="/shop" className="hidden text-sm font-medium text-green hover:underline sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* DOSHA EDUCATION */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow">Know your constitution</div>
          <h2 className="mt-2 text-3xl">Balance your dosha</h2>
          <p className="mt-3 text-inksoft">
            Ayurveda sees three energies in every body. Choose rituals that calm
            your excess and you’ll feel the difference.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="card p-6">
            <span className="dosha-pill vata">Vata</span>
            <h3 className="mt-3 font-serif text-xl">Air &amp; space</h3>
            <p className="mt-2 text-sm text-inksoft">
              Dry, light and quick. Loves warm oils, grounding routines and
              sesame-rich formulations.
            </p>
          </div>
          <div className="card p-6">
            <span className="dosha-pill pitta">Pitta</span>
            <h3 className="mt-3 font-serif text-xl">Fire &amp; water</h3>
            <p className="mt-2 text-sm text-inksoft">
              Warm, sharp and bright. Calms with sandalwood, manjistha and cooling
              rituals.
            </p>
          </div>
          <div className="card p-6">
            <span className="dosha-pill kapha">Kapha</span>
            <h3 className="mt-3 font-serif text-xl">Earth &amp; water</h3>
            <p className="mt-2 text-sm text-inksoft">
              Steady, oily and strong. Loves warming turmeric, neem and light
              cleansers.
            </p>
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bg-bgalt/60 py-14">
        <div className="container">
          <div className="mb-8 text-center">
            <div className="eyebrow">Loved by many</div>
            <h2 className="mt-2 text-3xl">Best sellers</h2>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="eyebrow">From the journal</div>
            <h2 className="mt-2 text-3xl">Ayurveda, simply</h2>
          </div>
          <Link href="/blog" className="hidden text-sm font-medium text-green hover:underline sm:block">
            All articles →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container pb-20">
        <div className="card flex flex-col items-center gap-4 bg-green px-6 py-12 text-center text-paper">
          <h2 className="font-serif text-3xl">Join the Vedika circle</h2>
          <p className="max-w-md text-paper/80">
            Dosha tips, new formulations and quiet rituals — once a fortnight, never
            noisy.
          </p>
          <form className="mt-2 flex w-full max-w-md flex-col gap-2 sm:flex-row" action="/api/newsletter" method="post">
            <input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="input flex-1 bg-paper text-ink"
            />
            <button type="submit" className="btn btn-gold">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  )
}
