import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronDown, ChevronUp, Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/i18n/LanguageContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const destinations = {
  Kyrgyzstan: ['Issyk-Kul', 'Song-Kul', 'Ala-Archa', 'Jeti-Oguz', 'Bishkek', 'Karakol', 'Osh', 'Pamir'],
  Kazakhstan: ['Almaty', 'Charyn Canyon', 'Kolsai Lakes', 'Astana'],
  Uzbekistan: ['Samarkand', 'Bukhara', 'Tashkent', 'Khiva'],
};

type Country = keyof typeof destinations;

// Season helper for 2026-2027
function getSeasonColor(date: Date): string {
  const m = date.getMonth(); // 0-indexed
  if (m >= 5 && m <= 8) return 'bg-green-400/30 text-green-900'; // Jun-Sep peak
  if (m === 4 || m === 9) return 'bg-yellow-400/30 text-yellow-900'; // May, Oct shoulder
  if (m >= 10 || m <= 3) return 'bg-red-400/20 text-red-900'; // Nov-Apr low
  return '';
}

function isLowSeason(date: Date): boolean {
  const m = date.getMonth();
  return m >= 10 || m <= 3;
}

export const HeroSearchForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Destinations
  const [selectedDests, setSelectedDests] = useState<string[]>([]);
  const [expandedCountries, setExpandedCountries] = useState<Country[]>([]);

  // Dates
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showSeasonWarning, setShowSeasonWarning] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date | undefined>();

  // Travelers
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const totalTravelers = adults + children + infants;

  const toggleCountry = (country: Country) => {
    setExpandedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleDest = (dest: string) => {
    setSelectedDests(prev =>
      prev.includes(dest) ? prev.filter(d => d !== dest) : [...prev, dest]
    );
  };

  const toggleAllCountry = (country: Country) => {
    const subs = destinations[country];
    const allSelected = subs.every(s => selectedDests.includes(s));
    if (allSelected) {
      setSelectedDests(prev => prev.filter(d => !subs.includes(d)));
    } else {
      setSelectedDests(prev => [...new Set([...prev, ...subs])]);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isLowSeason(date)) {
      setPendingDate(date);
      setShowSeasonWarning(true);
    } else {
      setSelectedDate(date);
      setShowSeasonWarning(false);
    }
  };

  const confirmLowSeason = () => {
    setSelectedDate(pendingDate);
    setShowSeasonWarning(false);
    setPendingDate(undefined);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDests.length) params.set('destinations', selectedDests.join(','));
    if (selectedDate) params.set('date', format(selectedDate, 'yyyy-MM-dd'));
    params.set('adults', String(adults));
    if (children > 0) params.set('children', String(children));
    if (infants > 0) params.set('infants', String(infants));
    navigate(`/search?${params.toString()}`);
  };

  const destLabel = selectedDests.length > 0
    ? selectedDests.length <= 2 ? selectedDests.join(', ') : `${selectedDests.length} selected`
    : t.hero.allDestinations;

  const dateLabel = selectedDate ? format(selectedDate, 'MMM d, yyyy') : t.hero.selectDates;

  const travelersLabel = `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}${infants > 0 ? `, ${infants} Infant${infants > 1 ? 's' : ''}` : ''}`;

  const Counter = ({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-sm font-medium w-4 text-center text-foreground">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-card/95 backdrop-blur-lg rounded-2xl shadow-lg p-4 md:p-6 border border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destinations */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl w-full text-left hover:bg-muted/80 transition-colors">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t.hero.whereTo}</p>
                <p className="text-sm font-medium text-foreground truncate">{destLabel}</p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 pointer-events-auto" align="start">
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {(Object.keys(destinations) as Country[]).map(country => {
                const subs = destinations[country];
                const allSelected = subs.every(s => selectedDests.includes(s));
                const someSelected = subs.some(s => selectedDests.includes(s));
                const isExpanded = expandedCountries.includes(country);

                return (
                  <div key={country}>
                    <div className="flex items-center gap-2 py-1.5 px-1">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                        onChange={() => toggleAllCountry(country)}
                        className="rounded border-border text-primary accent-primary w-4 h-4"
                      />
                      <span className="text-sm font-semibold text-foreground flex-1">{country}</span>
                      <button onClick={() => toggleCountry(country)} className="text-muted-foreground hover:text-foreground">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="ml-6 space-y-0.5">
                        {subs.map(sub => (
                          <label key={sub} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-muted cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedDests.includes(sub)}
                              onChange={() => toggleDest(sub)}
                              className="rounded border-border text-primary accent-primary w-3.5 h-3.5"
                            />
                            <span className="text-sm text-foreground">{sub}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {selectedDests.length > 0 && (
              <button onClick={() => setSelectedDests([])} className="mt-2 text-xs text-primary hover:underline">
                Clear all
              </button>
            )}
          </PopoverContent>
        </Popover>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl w-full text-left hover:bg-muted/80 transition-colors">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t.hero.when}</p>
                <p className="text-sm font-medium text-foreground truncate">{dateLabel}</p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            {showSeasonWarning ? (
              <div className="p-4 max-w-[300px] space-y-3">
                <p className="text-sm font-medium text-foreground">⚠️ Off-Peak Season</p>
                <p className="text-sm text-muted-foreground">
                  This is not peak season, but we can arrange a tour for an additional $50–200. Continue?
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={confirmLowSeason}>Yes, continue</Button>
                  <Button size="sm" variant="outline" onClick={() => { setShowSeasonWarning(false); setPendingDate(undefined); }}>
                    Pick another date
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <CalendarUI
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  fromDate={new Date(2026, 0, 1)}
                  toDate={new Date(2027, 11, 31)}
                  className={cn("p-3 pointer-events-auto")}
                  modifiers={{
                    peak: (date) => { const m = date.getMonth(); return m >= 5 && m <= 8; },
                    shoulder: (date) => { const m = date.getMonth(); return m === 4 || m === 9; },
                    low: (date) => { const m = date.getMonth(); return m >= 10 || m <= 3; },
                  }}
                  modifiersClassNames={{
                    peak: 'bg-green-100 text-green-800 hover:bg-green-200',
                    shoulder: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                    low: 'bg-red-50 text-red-800 hover:bg-red-100',
                  }}
                />
                <div className="flex gap-3 px-3 pb-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-200" /> Peak</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-200" /> Shoulder</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-100" /> Low</span>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Travelers */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl w-full text-left hover:bg-muted/80 transition-colors">
              <Users className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t.hero.travelers}</p>
                <p className="text-sm font-medium text-foreground truncate">{travelersLabel}</p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 pointer-events-auto" align="start">
            <Counter label="Adults" value={adults} onChange={setAdults} min={1} max={10} />
            <Counter label="Children (under 12)" value={children} onChange={setChildren} min={0} max={10} />
            <Counter label="Infants (under 2)" value={infants} onChange={setInfants} min={0} max={5} />
            <div className="pt-2 mt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">Total: {totalTravelers} traveler{totalTravelers > 1 ? 's' : ''}</p>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search */}
        <Button size="lg" className="h-full min-h-[52px] gap-2" onClick={handleSearch}>
          <Search className="w-4 h-4" />
          {t.hero.searchTours}
        </Button>
      </div>
    </div>
  );
};
