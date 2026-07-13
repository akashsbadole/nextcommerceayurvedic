import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const categories = [
  {
    title: 'Skin Care',
    slug: 'skin-care',
    description:
      'Classical Ayurvedic formulations for balanced, radiant skin — oils, lepams and ubtans crafted from wild-harvested herbs.',
    tagline: 'For balanced, radiant skin',
  },
  {
    title: 'Hair Care',
    slug: 'hair-care',
    description:
      'Hair and scalp rituals rooted in Kerala tradition — nourishing oils and powders that strengthen from root to tip.',
    tagline: 'Root-to-tip nourishment',
  },
  {
    title: 'Wellness',
    slug: 'wellness',
    description:
      'Daily wellness tonics and supplements drawn from classical Rasayana texts to support energy, sleep and balance.',
    tagline: 'Daily rasayana rituals',
  },
  {
    title: 'Immunity',
    slug: 'immunity',
    description:
      'Time-tested immunity boosters like Chyawanprash and guduchi to build everyday resilience.',
    tagline: 'Everyday resilience',
  },
]

const products = [
  {
    title: 'Kumkumadi Glow Oil',
    slug: 'kumkumadi-glow-oil',
    subtitle: 'Overnight Radiance Face Oil',
    description:
      'A 24-herb infused facial oil built on the classical Kumkumadi Tailam formula — saffron, sandalwood and manjistha steeped in sesame oil to fade pigmentation and restore natural radiance overnight.',
    images: ['/images/products/kumkumadi.jpg'],
    ingredients: ['Saffron', 'Sandalwood', 'Manjistha', 'Sesame Oil', 'Laksha', 'Vetiver'],
    keywords: ['glow', 'pigmentation', 'face oil', 'radiance'],
    price: 899,
    comparePrice: 1199,
    sku: 'VDK-SK-014',
    stock: 120,
    dosha: ['pitta', 'kapha'] as const,
    tag: 'Best Seller',
    rating: 4.9,
    reviewsCount: 412,
    isFeatured: true,
    isBestseller: true,
    categorySlug: 'skin-care',
  },
  {
    title: 'Eladi Hydrating Cream',
    slug: 'eladi-hydrating-cream',
    subtitle: 'Daily Moisture Cream',
    description:
      'A lightweight everyday cream formulated with Eladi herbs, aloe and Indian madder to calm sensitivity and lock in lasting moisture for all skin types.',
    images: ['/images/products/eladi-cream.jpg'],
    ingredients: ['Ela (Cardamom)', 'Aloe Vera', 'Manjistha', 'Jojoba Oil', 'Licorice'],
    keywords: ['moisturizer', 'hydration', 'sensitive skin'],
    price: 649,
    comparePrice: 749,
    sku: 'VDK-SK-021',
    stock: 90,
    dosha: ['vata', 'pitta'] as const,
    tag: 'New',
    rating: 4.7,
    reviewsCount: 188,
    isFeatured: true,
    isBestseller: false,
    categorySlug: 'skin-care',
  },
  {
    title: 'Nalpamaradi Brightening Oil',
    slug: 'nalpamaradi-brightening-oil',
    subtitle: 'Even-Tone Body Oil',
    description:
      'A traditional Nalpamaradi tailam that gently brightens and evens skin tone. Four sacred barks infused in sesame oil for a luminous, healthy glow.',
    images: ['/images/products/nalpamaradi.jpg'],
    ingredients: ['Nalpamara (4 barks)', 'Turmeric', 'Sesame Oil', 'Manjistha'],
    keywords: ['brightening', 'body oil', 'tan removal'],
    price: 799,
    comparePrice: null,
    sku: 'VDK-SK-033',
    stock: 75,
    dosha: ['kapha', 'pitta'] as const,
    tag: null,
    rating: 4.6,
    reviewsCount: 134,
    isFeatured: false,
    isBestseller: false,
    categorySlug: 'skin-care',
  },
  {
    title: 'Ubtan Glow Scrub',
    slug: 'ubtan-glow-scrub',
    subtitle: 'Weekly Exfoliating Lepam',
    description:
      'A gentle powdered ubtan of chickpea, wild turmeric and rose to exfoliate dead cells and reveal fresh, glowing skin — exactly as grandmothers made it.',
    images: ['/images/products/ubtan.jpg'],
    ingredients: ['Chickpea Flour', 'Wild Turmeric', 'Rose Petal', 'Sandalwood', 'Oat'],
    keywords: ['scrub', 'ubtan', 'exfoliation'],
    price: 499,
    comparePrice: 599,
    sku: 'VDK-SK-040',
    stock: 140,
    dosha: ['vata', 'kapha'] as const,
    tag: null,
    rating: 4.8,
    reviewsCount: 256,
    isFeatured: false,
    isBestseller: true,
    categorySlug: 'skin-care',
  },
  {
    title: 'Neelibhringadi Hair Oil',
    slug: 'neelibhringadi-hair-oil',
    subtitle: 'Growth & Anti-Grey Serum',
    description:
      'The legendary Kerala oil for hair growth and delayed greying — bhringraj, amla and indigo steeped in coconut milk to nourish the roots and deepen colour.',
    images: ['/images/products/neelibhringadi.jpg'],
    ingredients: ['Bhringraj', 'Amla', 'Indigo', 'Coconut Milk', 'Yashtimadhu'],
    keywords: ['hair growth', 'anti-grey', 'hair oil'],
    price: 749,
    comparePrice: 899,
    sku: 'VDK-HC-011',
    stock: 100,
    dosha: ['pitta', 'vata'] as const,
    tag: 'Best Seller',
    rating: 4.9,
    reviewsCount: 521,
    isFeatured: true,
    isBestseller: true,
    categorySlug: 'hair-care',
  },
  {
    title: 'Bhringraj Root Strengthener',
    slug: 'bhringraj-root-strengthener',
    subtitle: 'Scalp Tonic Powder',
    description:
      'A concentrated bhringraj and brahmi powder to mix into your oil or mask — strengthens follicles, reduces hair fall and soothes an itchy scalp.',
    images: ['/images/products/bhringraj-powder.jpg'],
    ingredients: ['Bhringraj', 'Brahmi', 'Amla', 'Hibiscus', 'Neem'],
    keywords: ['hair fall', 'scalp', 'powder'],
    price: 399,
    comparePrice: null,
    sku: 'VDK-HC-019',
    stock: 110,
    dosha: ['pitta'] as const,
    tag: null,
    rating: 4.5,
    reviewsCount: 97,
    isFeatured: false,
    isBestseller: false,
    categorySlug: 'hair-care',
  },
  {
    title: 'Amla Shikakai Shampoo',
    slug: 'amla-shikakai-shampoo',
    subtitle: 'Gentle Herbal Cleanser',
    description:
      'A sulfate-free cleanser built on reetha, shikakai and amla — cleans without stripping, leaving hair soft, voluminous and naturally conditioned.',
    images: ['/images/products/amla-shampoo.jpg'],
    ingredients: ['Amla', 'Shikakai', 'Reetha', 'Hibiscus', 'Fenugreek'],
    keywords: ['shampoo', 'herbal', 'cleanser'],
    price: 549,
    comparePrice: 649,
    sku: 'VDK-HC-024',
    stock: 85,
    dosha: ['vata', 'kapha'] as const,
    tag: 'New',
    rating: 4.6,
    reviewsCount: 143,
    isFeatured: false,
    isBestseller: false,
    categorySlug: 'hair-care',
  },
  {
    title: 'Triphala Detox Capsules',
    slug: 'triphala-detox-capsules',
    subtitle: 'Gut & Digestive Tonic',
    description:
      'The classical trio of amla, haritaki and bibhitaki to gently cleanse the gut, support regular digestion and kindle agni without harsh laxatives.',
    images: ['/images/products/triphala.jpg'],
    ingredients: ['Amla', 'Haritaki', 'Bibhitaki'],
    keywords: ['detox', 'digestion', 'gut'],
    price: 459,
    comparePrice: null,
    sku: 'VDK-WL-007',
    stock: 200,
    dosha: ['pitta', 'kapha'] as const,
    tag: 'Best Seller',
    rating: 4.7,
    reviewsCount: 309,
    isFeatured: true,
    isBestseller: true,
    categorySlug: 'wellness',
  },
  {
    title: 'Ashwagandha Calm Tonic',
    slug: 'ashwagandha-calm-tonic',
    subtitle: 'Stress & Sleep Support',
    description:
      'A warming ashwagandha and shatavari tonic to buffer daily stress, steady the nerves and promote restful sleep — your evening ritual in a spoon.',
    images: ['/images/products/ashwagandha.jpg'],
    ingredients: ['Ashwagandha', 'Shatavari', 'Nutmeg', 'Ghee', 'Jaggery'],
    keywords: ['stress', 'sleep', 'adaptogen'],
    price: 699,
    comparePrice: 799,
    sku: 'VDK-WL-015',
    stock: 130,
    dosha: ['vata'] as const,
    tag: null,
    rating: 4.8,
    reviewsCount: 221,
    isFeatured: false,
    isBestseller: false,
    categorySlug: 'wellness',
  },
  {
    title: 'Chyawanprash Rasayana',
    slug: 'chyawanprash-rasayana',
    subtitle: 'Classical Immunity Jam',
    description:
      'The 2,000-year-old jam of amla, dashamoola and 40+ herbs cooked in ghee and honey — a daily spoonful to build ojas, energy and resilience.',
    images: ['/images/products/chyawanprash.jpg'],
    ingredients: ['Amla', 'Dashamoola', 'Ghee', 'Honey', 'Cardamom'],
    keywords: ['immunity', 'rasayana', 'energy'],
    price: 525,
    comparePrice: 625,
    sku: 'VDK-IM-002',
    stock: 160,
    dosha: ['vata', 'pitta', 'kapha'] as const,
    tag: 'Best Seller',
    rating: 4.9,
    reviewsCount: 634,
    isFeatured: true,
    isBestseller: true,
    categorySlug: 'immunity',
  },
  {
    title: 'Guduchi Immunity Tablets',
    slug: 'guduchi-immunity-tablets',
    subtitle: 'Daily Defense',
    description:
      'Pure guduchi (giloy) tablets to support the body’s natural defenses, balance pitta and aid recovery through seasonal changes.',
    images: ['/images/products/guduchi.jpg'],
    ingredients: ['Guduchi (Giloy)'],
    keywords: ['immunity', 'giloy', 'detox'],
    price: 389,
    comparePrice: null,
    sku: 'VDK-IM-009',
    stock: 180,
    dosha: ['pitta'] as const,
    tag: null,
    rating: 4.5,
    reviewsCount: 112,
    isFeatured: false,
    isBestseller: false,
    categorySlug: 'immunity',
  },
  {
    title: 'Tulsi Ginger Immunity Tea',
    slug: 'tulsi-ginger-immunity-tea',
    subtitle: 'Soothing Herbal Infusion',
    description:
      'A daily infusion of holy basil, sunthi ginger and black pepper to warm the chest, clear the sinuses and keep immunity humming through the year.',
    images: ['/images/products/tulsi-tea.jpg'],
    ingredients: ['Tulsi', 'Ginger', 'Black Pepper', 'Cinnamon', 'Licorice'],
    keywords: ['tea', 'immunity', 'tulsi'],
    price: 349,
    comparePrice: 429,
    sku: 'VDK-IM-014',
    stock: 150,
    dosha: ['vata', 'kapha'] as const,
    tag: 'New',
    rating: 4.7,
    reviewsCount: 178,
    isFeatured: false,
    isBestseller: false,
    categorySlug: 'immunity',
  },
]

const blogPosts = [
  {
    slug: 'understanding-your-dosha',
    title: 'Understanding Your Dosha: A Beginner’s Guide',
    category: 'Ayurveda 101',
    excerpt:
      'Vata, pitta and kapha shape everything from your digestion to your skin. Here’s how to read your constitution and choose rituals that balance it.',
    content: `Ayurveda teaches that each of us is made of three energies — vata (air), pitta (fire) and kapha (earth). Most people are a blend, with one or two dominant.

Vata types tend toward dry skin, quick minds and cold hands. Pitta types run warm, focused and prone to redness. Kapha types are steady, oily-skinned and calm.

The goal is not to label yourself but to notice imbalance: a vata spike feels like anxiety and flakiness; a pitta excess shows as heat and irritation; kapha stagnation feels heavy and congested.

Choose products that counter your excess. Dry, vata skin loves sesame and ghee-rich oils. Pitta redness calms with sandalwood and manjistha. Kapha congestion clears with warming turmeric and neem.

Start with one ritual — a nightly facial oil or a morning tonic — and observe. Balance is a daily practice, not a destination.`,
    image: '/images/blog/dosha.jpg',
    readTime: '6 min read',
  },
  {
    slug: 'kumkumadi-oil-benefits',
    title: 'Why Kumkumadi Tailam Is the Queen of Face Oils',
    category: 'Skin Care',
    excerpt:
      'Five centuries old and still unrivalled — we break down the herbs that make this saffron infusion a radiance ritual worth keeping.',
    content: `Kumkumadi Tailam appears in the Siddha and Ayurvedic texts as a remedy for nearly every complexion concern. Its hero is saffron, which brightens and evens tone, supported by manjistha for clarity and sandalwood for calm.

The base matters as much as the herbs. Traditional preparations steep the botanicals in sesame oil over days, allowing fat-soluble actives to fully infuse.

Used nightly, a few drops massaged upward into clean skin can soften fine lines, fade spots and lend that lit-from-within glow. Consistency beats quantity — a little goes a long way.`,
    image: '/images/blog/kumkumadi.jpg',
    readTime: '5 min read',
  },
  {
    slug: 'ayurvedic-hair-care-ritual',
    title: 'Building an Ayurvedic Hair Care Ritual',
    category: 'Hair Care',
    excerpt:
      'Forget quick fixes. A weekly oiling practice with bhringraj and amla is what truly transforms thinning, tired hair.',
    content: `In Kerala households, hair oiling is non-negotiable. The practice — abhyanga for the scalp — improves circulation, feeds the follicle and calms the nervous system all at once.

Start with a warm oil rich in bhringraj and amla. Massage in slow circles for five minutes, then leave on for at least an hour, ideally overnight.

Follow with a gentle reetha-shikakai wash rather than harsh sulfates. Over weeks, you’ll notice less fall, deeper colour and a natural sheen no serum can fake.`,
    image: '/images/blog/hair.jpg',
    readTime: '7 min read',
  },
  {
    slug: 'daily-rasayana-for-energy',
    title: 'Daily Rasayana: Small Rituals for Lasting Energy',
    category: 'Wellness',
    excerpt:
      'Ojas — your reservoir of vitality — is built through tiny daily choices. Here are three rasayana habits to start this week.',
    content: `Rasayana is the Ayurvedic science of rejuvenation. The aim is ojas: a subtle essence that translates to immunity, glow and steady energy.

Habit one: a spoon of chyawanprash each morning with warm water. Habit two: early, light dinners to let digestion rest. Habit three: a few minutes of oil massage to ground the vata that scatters our energy.

None of these are dramatic. That’s the point. Rasayana works by accumulation, not intensity.`,
    image: '/images/blog/rasayana.jpg',
    readTime: '4 min read',
  },
  {
    slug: 'seasonal-immunity-with-tulsi',
    title: 'Seasonal Immunity: Keeping Tulsi Close',
    category: 'Immunity',
    excerpt:
      'As seasons shift, so does our vulnerability. A simple tulsi-ginger tea is your first line of defense.',
    content: `Tulsi — holy basil — is revered as a plant that purifies both air and body. Combined with warming ginger and pepper, it supports respiratory health exactly when the weather turns.

Brew a pot each morning through seasonal transitions. Sip through the day. Pair with guduchi tablets if you feel run down.

Immunity isn’t built in a week of supplements; it’s the sum of daily, gentle defenses like this.`,
    image: '/images/blog/tulsi.jpg',
    readTime: '5 min read',
  },
  {
    slug: 'reading-ayurvedic-ingredient-lists',
    title: 'How to Read an Ayurvedic Ingredient List',
    category: 'Ayurveda 101',
    excerpt:
      'Not all “herbal” labels are equal. Learn to spot authentic formulations versus marketing fluff.',
    content: `A genuine Ayurvedic product leads with its hero herb — kumkumadi, neelibhringadi, triphala — not fragrance or fillers.

Check the base oil: sesame, coconut and ghee are traditional and functional. Watch for long lists of synthetic preservatives or “parfum.”

Look for classical references. If a formula names a known tailam or leham, it’s likely rooted in text rather than trend. Authenticity shows up in specificity.`,
    image: '/images/blog/ingredients.jpg',
    readTime: '6 min read',
  },
]

async function main() {
  console.log('Seeding Vedika Ayurveda…')

  // users
  const adminHash = await bcrypt.hash('admin1234', 10)
  const userHash = await bcrypt.hash('customer123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@vedika.in' },
    update: {},
    create: {
      name: 'Vedika Admin',
      email: 'admin@vedika.in',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'customer@vedika.in' },
    update: {},
    create: {
      name: 'Ananya Rao',
      email: 'customer@vedika.in',
      passwordHash: userHash,
      role: 'CUSTOMER',
      phone: '9876543210',
    },
  })

  // categories
  const catMap = new Map<string, string>()
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { title: c.title, description: c.description, tagline: c.tagline },
      create: c,
    })
    catMap.set(c.slug, created.id)
  }

  // products
  for (const p of products) {
    const categoryId = catMap.get(p.categorySlug)!
    // remove helper field and flatten list columns to strings
    const { categorySlug, images, ingredients, keywords, dosha, ...rest } = p as any
    const data = {
      ...rest,
      categoryId,
      images: (images as string[]).join('\n'),
      ingredients: (ingredients as string[]).join('\n'),
      keywords: (keywords as string[]).join('\n'),
      dosha: (dosha as string[]).join(','),
    }
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    })
  }

  // blog posts
  for (const b of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    })
  }

  // site settings
  const settings: Record<string, string> = {
    siteName: 'Vedika Ayurveda',
    supportEmail: 'support@vedika.in',
    phone: '+91 98765 43210',
    address: 'Vedika Ayurveda, Bengaluru, Karnataka, India',
    freeShippingThreshold: '799',
    shippingFee: '59',
    instagram: '',
    facebook: '',
  }
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
  }

  // coupons
  const coupons = [
    { code: 'WELCOME10', type: 'percent', value: 10, minOrder: 499 },
    { code: 'AYUR100', type: 'fixed', value: 100, minOrder: 999 },
    { code: 'FESTIVE15', type: 'percent', value: 15, minOrder: 749, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) },
  ]
  for (const c of coupons) {
    const { code, ...rest } = c
    await prisma.coupon.upsert({
      where: { code },
      update: rest,
      create: { code, ...rest },
    })
  }

  console.log(`Seeded:
  - 2 users (admin@vedika.in / admin1234, customer@vedika.in / customer123)
  - ${categories.length} categories
  - ${products.length} products
  - ${blogPosts.length} blog posts
  - ${coupons.length} coupons`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
