import { ArrowUp } from 'lucide-react';
import { useSocials } from '../../hooks/useSocials';
import { DURATION } from '../../constants/animation';

export default function Footer() {
  const { socials } = useSocials();

  return (
    <footer className="relative z-10 border-t border-border">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Gourav Ojha.
          </p>

          <div className="flex items-center gap-6">
            {socials.filter(s => s.url).map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-muted hover:text-text transition-colors"
                style={{ transitionDuration: `${DURATION.hover}s` }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-text transition-all"
            style={{ transitionDuration: `${DURATION.hover}s` }}
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
