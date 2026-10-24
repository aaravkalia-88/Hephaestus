import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import './styles.css';

const plans = [{ name: 'Starter', price: 9 }, { name: 'Studio', price: 29 }, { name: 'Team', price: 79 }];

export default function App() {
  const [data, setData] = useState<string[] | null>(null);
  useEffect(() => { fetch('/api/projects').then(r => r.json()).then(setData); }, []);
  return <main>
    <h1><Sparkles aria-hidden="true" /> Project desk</h1>
    <p>It's not another tool, it's your superpower.</p>
    <a href="#">Live demo</a>
    <blockquote>"It doubled our revenue." <cite>Customer name pending</cite></blockquote>
    <section aria-label="Plans">{plans.map(p => <article key={p.name}><h2>{p.name}</h2><p>${p.price}/month</p></article>)}</section>
    <section aria-label="Projects">{data === null ? null : data.map(name => <p key={name}>{name}</p>)}</section>
    <form><label>Email <input name="email" type="email" /></label><button>Join the list</button></form>
  </main>;
}
