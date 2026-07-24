import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMe } from '@tuaka/api-client'

function cn(...parts: (string | boolean | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

// ─── Reveal-on-scroll ───────────────────────────────────────────────────────

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -80px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return {
    ref,
    className: cn(
      'transition-all duration-700 ease-out',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7',
    ),
  }
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function IconCheck({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function IconCard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect height="14" rx="2.5" width="20" x="2" y="5" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  )
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconDoc({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 15h6M9 11h3" />
    </svg>
  )
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11z" />
    </svg>
  )
}

function IconDollar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

// ─── Static content ─────────────────────────────────────────────────────────

const PAYMENT_BULLETS = [
  'Card, bank transfer, and mobile money in one checkout link',
  'Invoices mark themselves paid automatically — no manual reconciliation',
  'Built on payment infrastructure trusted across West Africa',
]

const TRUST_ITEMS = [
  {
    Icon: IconDoc,
    title: 'Professional PDF invoices, generated instantly',
    body: "Every invoice you send is a clean, branded PDF your customer can open, forward, or print — no formatting required.",
  },
  {
    Icon: IconShield,
    title: 'Reliable infrastructure, built to stay up',
    body: "Your invoicing shouldn't go down on payday. TuaKa is built on infrastructure designed for daily business use.",
  },
  {
    Icon: IconDollar,
    title: 'Real payment processing, not a simulation',
    body: 'Payments through Paystack and MTN MoMo settle the way your bank expects — no simulated transactions.',
  },
]

const TEAM_MEMBERS = [
  { initials: 'KM', name: 'Kofi Mensah', sub: 'Owner', tag: 'Admin', tagStyle: 'bg-brand-100 text-brand-600', avatarStyle: 'bg-brand-600 text-white', row: 'bg-brand-50' },
  { initials: 'EA', name: 'Efua Asante', sub: 'Accra branch', tag: 'Finance', tagStyle: 'bg-brand-900/[0.06] text-brand-900/55', avatarStyle: 'bg-brand-400 text-brand-900', row: '' },
  { initials: 'KO', name: 'Kwame Owusu', sub: 'Kumasi branch', tag: 'Sales', tagStyle: 'bg-brand-900/[0.06] text-brand-900/55', avatarStyle: 'bg-brand-100 text-brand-900', row: '' },
]

interface PricingTier {
  name: string
  blurb: string
  price: string
  features: string[]
  highlighted?: boolean
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    blurb: 'For solo owners getting started',
    price: 'GH₵0',
    features: ['5 invoices per month', 'PDF downloads', 'MoMo payments', '1 user'],
  },
  {
    name: 'Starter',
    blurb: 'For small teams ready to grow',
    price: 'GH₵35',
    features: ['Unlimited invoices', 'PDF downloads', 'MoMo payments', 'Up to 3 team members', 'Email support'],
    highlighted: true,
  },
  {
    name: 'Growth',
    blurb: 'For teams that need more room to grow',
    price: 'GH₵75',
    features: ['Unlimited invoices', 'PDF downloads', 'MoMo payments', 'Up to 10 team members', 'Priority support', 'Custom invoice prefix'],
  },
]

const FOOTER_LINKS = {
  Product: [
    { label: 'Payments', href: '#payments' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Security', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  Support: [
    { label: 'Help center', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Status', href: '#' },
  ],
}

// ─── Page ───────────────────────────────────────────────────────────────────

export function LandingPage() {
  const navigate = useNavigate()
  const { data: me, isLoading } = useMe()

  useEffect(() => {
    if (me) navigate('/dashboard', { replace: true })
  }, [me, navigate])

  const payments = useReveal<HTMLDivElement>()
  const teams = useReveal<HTMLDivElement>()
  const trust = useReveal<HTMLDivElement>()
  const pricing = useReveal<HTMLDivElement>()
  const cta = useReveal<HTMLDivElement>()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const goToRegister = () => navigate('/register')

  if (isLoading || me) return null

  return (
    <div className="bg-white text-brand-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-brand-900/[0.08] bg-white/90 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-6 py-4 sm:px-8">
          <div className="font-logo text-2xl tracking-tight text-gray-900">
            Tua<span className="text-brand-600">Ka</span>
          </div>
          <div className="hidden items-center gap-6 md:flex md:gap-10">
            <a className="text-sm font-medium text-brand-900/75 hover:text-brand-400" href="#payments">Payments</a>
            <a className="text-sm font-medium text-brand-900/75 hover:text-brand-400" href="#teams">Teams</a>
            <a className="text-sm font-medium text-brand-900/75 hover:text-brand-400" href="#pricing">Pricing</a>
            <Link className="text-sm font-medium text-brand-900/75 hover:text-brand-400" to="/login">Log in</Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="rounded-lg bg-brand-400 px-4 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-brand-600 sm:px-5 sm:py-2.5"
              type="button"
              onClick={goToRegister}
            >
              Start free
            </button>
            <button
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-brand-900/75 transition-colors hover:bg-brand-900/5 md:hidden"
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              {mobileMenuOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="flex flex-col gap-1 border-t border-brand-900/[0.08] bg-white px-6 py-3 md:hidden">
            <a className="rounded-lg px-2 py-2.5 text-sm font-medium text-brand-900/75 hover:bg-brand-50 hover:text-brand-600" href="#payments" onClick={() => setMobileMenuOpen(false)}>Payments</a>
            <a className="rounded-lg px-2 py-2.5 text-sm font-medium text-brand-900/75 hover:bg-brand-50 hover:text-brand-600" href="#teams" onClick={() => setMobileMenuOpen(false)}>Teams</a>
            <a className="rounded-lg px-2 py-2.5 text-sm font-medium text-brand-900/75 hover:bg-brand-50 hover:text-brand-600" href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <Link className="rounded-lg px-2 py-2.5 text-sm font-medium text-brand-900/75 hover:bg-brand-50 hover:text-brand-600" to="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900 px-6 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24 lg:pt-[100px] lg:pb-[130px]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(159,225,203,0.10) 1.5px, transparent 1.5px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="relative z-10 mx-auto grid max-w-[1360px] grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-[60px]">
          <div>
            <div className="landing-fade-up inline-flex items-center gap-2 rounded-full border border-brand-100/25 bg-brand-100/10 px-3.5 py-1.5 text-[13px] font-semibold text-brand-100">
              Built for Paystack &amp; MoMo
            </div>
            <h1 className="landing-fade-up mt-6 text-[36px] font-bold leading-[1.12] tracking-tight text-white sm:text-[44px] lg:text-[52px]" style={{ animationDelay: '0.08s' }}>
              Invoicing built for how West African businesses actually get paid.
            </h1>
            <p className="landing-fade-up mb-8 max-w-[480px] text-base leading-relaxed text-brand-50/75 sm:text-lg" style={{ animationDelay: '0.16s' }}>
              Create professional invoices, collect payment with Paystack and MoMo, and keep your whole team working from the same books — all from one place built for how you actually run your business.
            </p>
            <div className="landing-fade-up flex flex-wrap items-center gap-4" style={{ animationDelay: '0.24s' }}>
              <button
                className="rounded-[10px] bg-brand-400 px-7 py-[15px] font-sans text-base font-bold text-brand-900 transition-all hover:-translate-y-0.5 hover:bg-brand-100"
                type="button"
                onClick={goToRegister}
              >
                Create your free account
              </button>
              <a className="inline-flex items-center gap-2 px-2 py-[15px] text-base font-semibold text-white hover:text-brand-100" href="#payments">
                See how it works
                <IconArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative z-10 flex justify-center">
            <div className="landing-float relative w-full max-w-[380px] rounded-[18px] bg-white p-7 shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
              <div className="mb-[22px] flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold tracking-wide text-brand-900/50">INVOICE</div>
                  <div className="text-[19px] font-bold text-brand-900">#TK-1042</div>
                </div>
                <div className="text-right text-xs text-brand-900/50">
                  Boateng Trading Co.<br />Due Jul 30, 2026
                </div>
              </div>
              <div className="mb-[18px] flex flex-col gap-2.5">
                <div className="flex justify-between text-[13px] text-brand-900/60">
                  <span>Fabric — 40 yards</span><span>GH₵4,800</span>
                </div>
                <div className="flex justify-between text-[13px] text-brand-900/60">
                  <span>Delivery &amp; handling</span><span>GH₵320</span>
                </div>
                <div className="h-px bg-brand-900/[0.08]" />
                <div className="flex justify-between text-base font-bold text-brand-900">
                  <span>Total due</span><span>GH₵5,120</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1.5 text-[11px] font-bold text-brand-600">
                  <img alt="" className="h-3.5 w-3.5 object-contain" src="/paystack-icon.png" />
                  Paystack
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1.5 text-[11px] font-bold text-brand-600">
                  <img alt="" className="h-3.5 w-3.5 rounded-sm object-cover" src="/momo-icon.png" />
                  MoMo
                </div>
              </div>
              <div className="landing-float-badge absolute -right-5 -top-3.5 rounded-lg bg-brand-400 px-4 py-2 text-[13px] font-bold text-white shadow-[0_12px_24px_rgba(37,165,114,0.4)]">
                ✓ Paid
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payments */}
      <section className="mx-auto max-w-[1360px] px-6 py-24 sm:px-8 lg:py-[120px]" id="payments">
        <div ref={payments.ref} className={payments.className}>
          <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-[70px]">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <IconCard className="h-6 w-6 text-brand-600" />
              </div>
              <h2 className="mb-[18px] text-[28px] font-bold tracking-tight sm:text-[32px] lg:text-[38px]">
                Get paid the way your customers already pay.
              </h2>
              <p className="mb-7 max-w-[460px] text-[17px] leading-[1.7] text-brand-900/70">
                No more chasing bank transfers or guessing which payment matches which invoice. TuaKa connects directly to Paystack and MTN MoMo, so customers pay in a tap and every invoice updates itself the moment money lands.
              </p>
              <div className="flex flex-col gap-4">
                {PAYMENT_BULLETS.map((line) => (
                  <div key={line} className="flex items-start gap-3">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                    <span className="text-[15px] text-brand-900/80">{line}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-[18px] rounded-2xl border border-brand-900/[0.08] bg-white p-[26px] shadow-[0_12px_32px_rgba(4,52,44,0.06)] transition-transform duration-300 hover:-translate-y-1">
                <img
                  alt="Paystack"
                  className="h-[52px] w-[52px] shrink-0 rounded-xl object-contain"
                  src="/paystack-icon.png"
                />
                <div>
                  <div className="text-base font-bold">Paystack</div>
                  <div className="text-[13.5px] text-brand-900/60">Cards, bank transfers &amp; direct debit</div>
                </div>
              </div>
              <div className="flex items-center gap-[18px] rounded-2xl border border-brand-900/[0.08] bg-white p-[26px] shadow-[0_12px_32px_rgba(4,52,44,0.06)] transition-transform duration-300 hover:-translate-y-1">
                <img
                  alt="MTN MoMo"
                  className="h-[52px] w-[52px] shrink-0 rounded-xl object-cover"
                  src="/momo-icon.png"
                />
                <div>
                  <div className="text-base font-bold">MoMo</div>
                  <div className="text-[13.5px] text-brand-900/60">Mobile money, straight from a phone number</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teams */}
      <section className="bg-brand-50 px-6 py-24 sm:px-8 lg:py-[120px]" id="teams">
        <div ref={teams.ref} className={teams.className}>
          <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-[70px]">
            <div className="rounded-[18px] bg-white p-8 shadow-[0_20px_50px_rgba(4,52,44,0.1)]">
              <div className="mb-[18px] text-[13px] font-bold tracking-wide text-brand-900/50">BOATENG TRADING CO.</div>
              <div className="flex flex-col gap-3.5">
                {TEAM_MEMBERS.map((m) => (
                  <div key={m.initials} className={cn('flex items-center justify-between rounded-[10px] px-3.5 py-3', m.row)}>
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-[34px] w-[34px] items-center justify-center rounded-full text-[13px] font-bold', m.avatarStyle)}>
                        {m.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{m.name}</div>
                        <div className="text-xs text-brand-900/55">{m.sub}</div>
                      </div>
                    </div>
                    <div className={cn('rounded-full px-2.5 py-1 text-[11.5px] font-bold', m.tagStyle)}>{m.tag}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                <IconUsers className="h-6 w-6 text-brand-600" />
              </div>
              <h2 className="mb-[18px] text-[28px] font-bold tracking-tight sm:text-[32px] lg:text-[38px]">
                Built for real organizations, not just one person with a laptop.
              </h2>
              <p className="max-w-[480px] text-[17px] leading-[1.7] text-brand-900/70">
                Add your accountant, your branch managers, your sales team — each with their own login and the right level of access. Run one business or five locations from a single TuaKa account, with everyone looking at the same numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-brand-50 px-6 py-28 sm:px-8 lg:py-[130px]" id="trust">
        <div className="mx-auto max-w-[1360px]">
          <div ref={trust.ref} className={trust.className}>
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
              <div>
                <div className="mb-4 text-[13px] font-bold tracking-wide text-brand-400">BUILT TO LAST</div>
                <h2 className="text-[30px] font-bold leading-[1.18] tracking-tight sm:text-[34px] lg:text-[40px]">
                  Not a prototype. Not a beta. TuaKa is built on the same payment infrastructure serious businesses rely on.
                </h2>
              </div>
              <div className="flex flex-col">
                {TRUST_ITEMS.map(({ Icon, title, body }, i) => (
                  <div
                    key={title}
                    className={cn(
                      'flex gap-4 py-[22px]',
                      i < TRUST_ITEMS.length - 1 && 'border-b border-brand-900/[0.12]',
                    )}
                  >
                    <Icon className="mt-0.5 h-[22px] w-[22px] shrink-0 text-brand-600" />
                    <div>
                      <div className="mb-1 text-base font-bold text-brand-900">{title}</div>
                      <div className="text-[14.5px] leading-[1.6] text-brand-900/[0.78]">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-brand-900 px-6 py-28 sm:px-8 lg:py-[130px]" id="pricing">
        <div ref={pricing.ref} className={pricing.className}>
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-16 text-center">
              <div className="mb-3.5 text-[13px] font-bold tracking-wide text-brand-100">PRICING</div>
              <h2 className="mb-3.5 text-[28px] font-bold tracking-tight text-white sm:text-[32px] lg:text-[38px]">
                Simple pricing that grows with your business.
              </h2>
              <p className="mx-auto max-w-[520px] text-base text-brand-50/65">
                Start free. Upgrade only when your team or your invoice volume actually needs it.
              </p>
            </div>
            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={cn(
                    'relative rounded-[18px]',
                    tier.highlighted
                      ? 'scale-100 bg-white p-9 shadow-[0_30px_60px_rgba(0,0,0,0.35)] lg:scale-[1.04] px-[30px]'
                      : 'border border-white/10 bg-white/[0.04] p-9 px-[30px]',
                  )}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-400 px-4 py-1.5 text-xs font-bold text-brand-900">
                      Most popular
                    </div>
                  )}
                  <div className={cn('mb-1.5 text-[17px] font-bold', tier.highlighted ? 'text-brand-900' : 'text-white')}>
                    {tier.name}
                  </div>
                  <div className={cn('mb-[22px] text-sm', tier.highlighted ? 'text-brand-900/60' : 'text-brand-50/60')}>
                    {tier.blurb}
                  </div>
                  <div className={cn('mb-[26px] text-[38px] font-bold', tier.highlighted ? 'text-brand-900' : 'text-white')}>
                    {tier.price}
                    <span className={cn('text-[15px] font-medium', tier.highlighted ? 'text-brand-900/50' : 'text-brand-50/50')}>/mo</span>
                  </div>
                  <div className="mb-[30px] flex flex-col gap-3">
                    {tier.features.map((f) => (
                      <div key={f} className={cn('flex gap-2.5 text-sm', tier.highlighted ? 'text-brand-900/80' : 'text-brand-50/80')}>
                        <IconCheck className={cn('h-4 w-4 shrink-0', tier.highlighted ? 'text-brand-600' : 'text-brand-100')} strokeWidth={2.4} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <button
                    className={cn(
                      'w-full rounded-[9px] py-3.5 font-sans text-[15px] font-bold transition-colors',
                      tier.highlighted
                        ? 'bg-brand-400 text-brand-900 hover:bg-brand-600 hover:text-white'
                        : 'border-[1.5px] border-white/30 bg-transparent text-white hover:border-brand-100',
                    )}
                    type="button"
                    onClick={goToRegister}
                  >
                    Get started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-50 px-6 py-28 text-center sm:px-8 lg:py-[110px]" id="cta">
        <div ref={cta.ref} className={cta.className}>
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, rgba(37,165,114,0.16), transparent 65%)' }}
          />
          <div className="relative z-10 mx-auto max-w-[640px]">
            <h2 className="mb-[18px] text-[30px] font-bold tracking-tight text-brand-900 sm:text-[36px] lg:text-[42px]">
              Ready to get paid faster?
            </h2>
            <p className="mb-[34px] text-[17px] text-brand-900/70">
              Set up your invoicing, payments, and team — all from one place.
            </p>
            <button
              className="rounded-[10px] bg-brand-400 px-8 py-[17px] font-sans text-base font-bold text-brand-900 transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:text-white sm:text-[17px]"
              type="button"
              onClick={goToRegister}
            >
              Create your free account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 px-6 pb-9 pt-16 sm:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-white/10 pb-12 lg:grid-cols-4">
            <div className="col-span-2 lg:col-span-1">
              <div className="mb-3 font-logo text-2xl text-white">
                Tua<span className="text-brand-100">Ka</span>
              </div>
              <div className="max-w-[280px] text-sm leading-relaxed text-brand-50/55">
                Invoicing and payments built for West African SMBs.
              </div>
            </div>
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <div className="mb-4 text-[13px] font-bold text-white">{heading}</div>
                <div className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <a key={link.label} className="text-sm text-brand-50/60 hover:text-brand-100" href={link.href}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-[13px] text-brand-50/45">
            <div>© {new Date().getFullYear()} TuaKa. All rights reserved.</div>
            <div className="flex gap-6">
              <a className="hover:text-brand-100" href="/privacy">Privacy</a>
              <a className="hover:text-brand-100" href="/terms">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
