import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface BookingFormModalProps {
  open: boolean;
  onClose: () => void;
  tourTitle: string;
  tourPrice: number;
}

const WHATSAPP_NUMBER = '996703404054';
const EMAIL = 'Mountainmagictours@gmail.com';

export const BookingFormModal = ({ open, onClose, tourTitle, tourPrice }: BookingFormModalProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dates: '',
    people: '1',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const buildMessage = () => {
    return [
      `Booking Request: ${tourTitle}`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone/WhatsApp: ${form.phone}`,
      `Preferred Dates: ${form.dates}`,
      `People: ${form.people}`,
      `Message: ${form.message || '—'}`,
    ].join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return;

    setSending(true);

    // Send via mailto
    const subject = encodeURIComponent(`Booking: ${tourTitle}`);
    const body = encodeURIComponent(buildMessage());
    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, '_blank');

    // Also open WhatsApp
    const waText = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, '_blank');

    toast({
      title: 'Заявка отправлена!',
      description: 'Мы свяжемся с вами скоро.',
    });

    setSending(false);
    setForm({ name: '', email: '', phone: '', dates: '', people: '1', message: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-2xl p-6 md:p-8 shadow-2xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Book: {tourTitle}</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bk-name">Name *</Label>
                <Input id="bk-name" value={form.name} onChange={(e) => update('name', e.target.value)} required maxLength={100} />
              </div>
              <div>
                <Label htmlFor="bk-email">Email *</Label>
                <Input id="bk-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required maxLength={255} />
              </div>
              <div>
                <Label htmlFor="bk-phone">Phone / WhatsApp *</Label>
                <Input id="bk-phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required maxLength={20} placeholder="+996..." />
              </div>
              <div>
                <Label htmlFor="bk-dates">Preferred Dates</Label>
                <Input id="bk-dates" value={form.dates} onChange={(e) => update('dates', e.target.value)} placeholder="e.g. June 15–20, 2026" maxLength={100} />
              </div>
              <div>
                <Label htmlFor="bk-people">Number of People</Label>
                <Input id="bk-people" type="number" min={1} max={20} value={form.people} onChange={(e) => update('people', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="bk-msg">Message</Label>
                <Textarea id="bk-msg" value={form.message} onChange={(e) => update('message', e.target.value)} rows={3} maxLength={1000} placeholder="Any special requests..." />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={sending}>
                <Send className="w-4 h-4 mr-2" />
                Send Booking Request
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your request will be sent via email and WhatsApp. We'll respond within 24 hours.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
