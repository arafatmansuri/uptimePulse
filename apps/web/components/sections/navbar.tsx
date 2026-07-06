'use client';

import { Container } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { Activity, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-ink-950 shadow-glow">
            <Activity className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">UptimePulse</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink-300 transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/signin" className="text-sm font-semibold text-ink-200 transition hover:text-white">
            Sign in
          </Link>
          <Button size="sm" onClick={()=>{
            navigate.push("/signup")
          }} className={`cursor-pointer`}>
            <Link href="/signup" className="group flex items-center gap-1.5">
              <span>Start free</span>
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-ink-800 text-ink-200 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-ink-800 bg-ink-950/95 backdrop-blur-xl md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-200 hover:bg-ink-900"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={()=>navigate.push('/signin')}>
                <a href="#">Sign in</a>
              </Button>
              <Button className="flex-1" onClick={()=>navigate.push('/signup')}>
                <a href="#" className="group flex items-center justify-center gap-1.5">
                  <span>Start free</span>
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </a>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
