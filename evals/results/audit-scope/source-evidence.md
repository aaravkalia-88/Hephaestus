# Source evidence

Project: `evals/fixtures/source-review`
Baseline: `sha256:0d39264e588c247025c480fa6d4c1349c0ba06e08de18ce08cd5af0d3ddabd29`

All observations below are source or owner evidence. No runtime was started.

## BRIEF.md

```text
  1: # Source-review fixture
  2: 
  3: This is a synthetic React source fixture, not a runnable application or a real business. It has no installed dependencies, server or browser target. Do not install packages to make it run.
  4: 
  5: Owner context: violet `#7c3aed` is an explicitly approved brand color. Starter, Studio and Team are exactly three genuine, owner-configured plans for this fixture; preserve their names and prices. The provenance of the testimonial is unknown. No live demonstration URL or privacy-policy facts have been supplied. Work is audit-only.
```

## App.tsx

```text
  1: import { useEffect, useState } from 'react';
  2: import { Sparkles } from 'lucide-react';
  3: import './styles.css';
  4: 
  5: const plans = [{ name: 'Starter', price: 9 }, { name: 'Studio', price: 29 }, { name: 'Team', price: 79 }];
  6: 
  7: export default function App() {
  8:   const [data, setData] = useState<string[] | null>(null);
  9:   useEffect(() => { fetch('/api/projects').then(r => r.json()).then(setData); }, []);
 10:   return <main>
 11:     <h1><Sparkles aria-hidden="true" /> Project desk</h1>
 12:     <p>It's not another tool, it's your superpower.</p>
 13:     <a href="#">Live demo</a>
 14:     <blockquote>"It doubled our revenue." <cite>Customer name pending</cite></blockquote>
 15:     <section aria-label="Plans">{plans.map(p => <article key={p.name}><h2>{p.name}</h2><p>${p.price}/month</p></article>)}</section>
 16:     <section aria-label="Projects">{data === null ? null : data.map(name => <p key={name}>{name}</p>)}</section>
 17:     <form><label>Email <input name="email" type="email" /></label><button>Join the list</button></form>
 18:   </main>;
 19: }
```

## styles.css

```text
  1: :root { --brand: #7c3aed; }
  2: body { background: #ffffff; font-family: Inter, sans-serif; }
  3: h1 { color: var(--brand); }
  4: section[aria-label="Plans"] { display: grid; grid-template-columns: repeat(3, 1fr); }
  5: article { border-radius: 32px; box-shadow: 0 24px 64px #0003; }
```
