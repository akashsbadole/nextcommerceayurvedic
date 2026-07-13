import Link from 'next/link'

export default function AboutPage() {
  return (
    <div>
      <section className="bg-bgalt">
        <div className="container py-16 text-center">
          <div className="eyebrow">Our story</div>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl sm:text-5xl">
            Rooted in 2,000-year-old texts, made for modern life
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-inksoft">
            Vedika Ayurveda began in a small Kerala kitchen, recreating the
            formulations our grandmothers trusted — slowly, and without shortcuts.
          </p>
        </div>
      </section>

      <section className="container grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl">What we believe</h2>
          <p className="mt-4 leading-relaxed text-inksoft">
            Ayurveda is not a trend. It is a way of living in balance with your
            own constitution — your dosha. Every product we make starts from a
            classical recipe: Kumkumadi Tailam, Neelibhringadi, Chyawanprash and
            more, prepared with the same herbs and bases the texts call for.
          </p>
          <p className="mt-4 leading-relaxed text-inksoft">
            We work with wild-harvested and organically grown herbs, cook in small
            batches, and never add parabens, sulfates or synthetic fragrance.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ['Small batch', 'Made in limited runs for freshness'],
            ['Authentic herbs', 'Sourced from native growing regions'],
            ['No nasties', 'Free from parabens & sulfates'],
            ['Tested by family', 'Not on animals, ever'],
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <h3 className="font-serif text-lg text-green">{t}</h3>
              <p className="mt-1 text-sm text-inksoft">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="card flex flex-col items-center gap-4 bg-green px-6 py-12 text-center text-paper">
          <h2 className="font-serif text-3xl">Start your ritual</h2>
          <p className="max-w-md text-paper/80">Find the formulation that fits your dosha and your day.</p>
          <Link href="/shop" className="btn btn-gold">Shop formulations</Link>
        </div>
      </section>
    </div>
  )
}
