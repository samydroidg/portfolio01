import { Download, Coffee, Code2, BookOpen } from 'lucide-react';
import Card from '../ui/Card';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import { usePortfolio } from '../../hooks/usePortfolio';

export default function About() {
  const { data } = usePortfolio();
  const person = data?.personal;

  const highlights = [
    { icon: <Code2 size={16} />, label: 'Full-stack development', desc: 'Building end-to-end product solutions' },
    { icon: <BookOpen size={16} />, label: 'Continuous learning', desc: 'Growing skills through real projects' },
    { icon: <Coffee size={16} />, label: 'Problem solver', desc: 'Engineer by mindset, builder by nature' },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="section-container">
        <SectionHeading title="About" subtitle="Who I am, what I do, and why I build." />

        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          <Reveal className="lg:col-span-3">
            <Card className="p-8 lg:p-10">
              <h3 className="text-xl font-medium mb-4">
                Hello, I'm <span className="text-text-muted">{person?.name}</span>
              </h3>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>{person?.aboutIntro || 'I build products, engineer systems, and solve real-world problems.'}</p>
                <p>{person?.aboutDetail || 'I care about clean architecture, thoughtful design, and systems that scale with purpose.'}</p>
              </div>

              {person?.philosophy && (
                <div className="mt-6 p-4 rounded-lg bg-accent-soft border border-accent-border">
                  <p className="text-sm text-text-secondary italic leading-relaxed">"{person.philosophy}"</p>
                </div>
              )}

              <div className="mt-6">
                <a
                  href={person?.resumeUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium glass hover:bg-white/10 dark:hover:bg-white/8 text-text-secondary hover:text-text transition-all"
                >
                  <Download size={14} />
                  Resume
                </a>
              </div>
            </Card>
          </Reveal>

          <div className="lg:col-span-2 space-y-4">
            <Reveal delay={0.1}>
              <Card glass className="p-6">
                <p className="text-xs text-text-muted mb-1 font-medium">Location</p>
                <p className="text-sm">{person?.location || 'India'}</p>
              </Card>
            </Reveal>
            <Reveal delay={0.15}>
              <Card glass className="p-6">
                <p className="text-xs text-text-muted mb-1 font-medium">Email</p>
                <p className="text-sm">{person?.email || 'Add your email in portfolio.json'}</p>
              </Card>
            </Reveal>
            <Reveal delay={0.2}>
              <Card glass className="p-6">
                <p className="text-xs text-text-muted mb-1 font-medium">Status</p>
                <p className="text-sm">{person?.availability || 'Building products'}</p>
              </Card>
            </Reveal>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {highlights.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <Card className="p-6 text-center" hover>
                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center mx-auto mb-3">
                  <span className="text-text-muted">{item.icon}</span>
                </div>
                <p className="text-sm font-medium mb-1">{item.label}</p>
                <p className="text-xs text-text-muted">{item.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
