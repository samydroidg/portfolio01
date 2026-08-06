import { useState } from 'react';
import { Send, Check, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Reveal from '../ui/Reveal';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useSocials } from '../../hooks/useSocials';
import { DURATION, EASE } from '../../constants/animation';
import { submitContactMessage } from '../../utils/contact';

export default function Contact() {
  const { data } = usePortfolio();
  const { socials } = useSocials();
  const person = data?.personal;
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honey, setHoney] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setError(null);
    const result = await submitContactMessage({
      name: form.name,
      email: form.email,
      message: form.message,
      honey,
    });
    if (!result.ok) {
      setError(result.error ?? 'Message could not be sent. Please try again.');
      setSending(false);
      return;
    }
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setHoney('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="contact" className="section-padding">
      <div className="section-container max-w-5xl">
        <SectionHeading title="Contact" subtitle="Get in touch if you'd like to work together." />

        <div className="grid md:grid-cols-5 gap-6">
          <Reveal className="md:col-span-2 space-y-4">
            <Card glass className="p-6">
              <p className="text-xs text-text-muted mb-1 font-medium">Email</p>
              <p className="text-sm">{person?.email || 'Add your email'}</p>
            </Card>
            <Card glass className="p-6">
              <p className="text-xs text-text-muted mb-1 font-medium">Location</p>
              <p className="text-sm">{person?.location || 'India'}</p>
            </Card>
            <Card glass className="p-6">
              <p className="text-xs text-text-muted mb-3 font-medium">Social</p>
              <div className="flex flex-col gap-2">
                {socials.filter(s => s.url).map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-muted hover:text-text transition-colors inline-flex items-center gap-1.5 w-fit"
                    style={{ transitionDuration: `${DURATION.hover}s` }}
                  >
                    {link.label}
                    <ArrowUpRight size={11} />
                  </a>
                ))}
                {socials.every(s => !s.url) && (
                  <p className="text-xs text-text-muted/60">Add URLs in socials.json</p>
                )}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-3">
            <Card glass className="p-6 lg:p-8">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.modal, ease: EASE.out }}
                    className="flex flex-col items-center justify-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
                      className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mb-4"
                    >
                      <Check size={20} className="text-accent" />
                    </motion.div>
                    <p className="font-medium mb-1">Message sent</p>
                    <p className="text-sm text-text-muted">Thanks for reaching out. I'll respond shortly.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    <input
                      type="text"
                      name="_honey"
                      value={honey}
                      onChange={e => setHoney(e.target.value)}
                      className="hidden"
                      aria-hidden="true"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="relative">
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          placeholder=" "
                          onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                          className={`peer w-full px-4 pt-6 pb-2 rounded-lg border bg-transparent text-sm outline-none transition-all ${errors.name ? 'border-red-500/40' : 'border-border focus:border-accent-border'} focus:shadow-glow`}
                          style={{ transitionDuration: `${DURATION.hover}s` }}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        />
                        <label htmlFor="contact-name" className="absolute left-4 top-4 text-sm text-text-muted transition-all pointer-events-none peer-focus:text-xs peer-focus:top-2 peer-focus:text-accent peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2" style={{ transitionDuration: `${DURATION.hover}s` }}>Name</label>
                        {errors.name && <motion.p id="contact-name-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1.5" role="alert">{errors.name}</motion.p>}
                      </div>
                      <div className="relative">
                        <input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          placeholder=" "
                          onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                          className={`peer w-full px-4 pt-6 pb-2 rounded-lg border bg-transparent text-sm outline-none transition-all ${errors.email ? 'border-red-500/40' : 'border-border focus:border-accent-border'} focus:shadow-glow`}
                          style={{ transitionDuration: `${DURATION.hover}s` }}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        />
                        <label htmlFor="contact-email" className="absolute left-4 top-4 text-sm text-text-muted transition-all pointer-events-none peer-focus:text-xs peer-focus:top-2 peer-focus:text-accent peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2" style={{ transitionDuration: `${DURATION.hover}s` }}>Email</label>
                        {errors.email && <motion.p id="contact-email-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1.5" role="alert">{errors.email}</motion.p>}
                      </div>
                    </div>
                    <div className="relative">
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={form.message}
                        placeholder=" "
                        onChange={e => { setForm(p => ({ ...p, message: e.target.value })); setErrors(p => ({ ...p, message: '' })); }}
                        className={`peer w-full px-4 pt-6 pb-2 rounded-lg border bg-transparent text-sm outline-none transition-all resize-none ${errors.message ? 'border-red-500/40' : 'border-border focus:border-accent-border'} focus:shadow-glow`}
                        style={{ transitionDuration: `${DURATION.hover}s` }}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      />
                      <label htmlFor="contact-message" className="absolute left-4 top-4 text-sm text-text-muted transition-all pointer-events-none peer-focus:text-xs peer-focus:top-2 peer-focus:text-accent peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2" style={{ transitionDuration: `${DURATION.hover}s` }}>Message</label>
                      {errors.message && <motion.p id="contact-message-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1.5" role="alert">{errors.message}</motion.p>}
                    </div>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500"
                        role="alert"
                      >
                        {error}
                      </motion.p>
                    )}
                    <button
                      type="submit"
                      disabled={sending}
                      className="relative w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:brightness-110 shadow-soft hover:shadow-elevated transition-all disabled:opacity-60"
                      style={{ transitionDuration: `${DURATION.hover}s` }}
                    >
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send size={14} />
                          Send message
                        </span>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
