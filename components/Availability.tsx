import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { ChevronLeft, ChevronRight, Send, ArrowLeft, Globe, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// --------------------------------------------------------------------------
// GOOGLE APPS SCRIPT BACKEND CONFIGURATION
// The backend is hosted as a Google Apps Script Web App.
// --------------------------------------------------------------------------
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzA6KW-e43M3uT57G4O5aCCRDAE9m4oUChTuW0vbWDJaPt0MNn_EvJ2vT5ROTauqSmQ/exec"; 

// Host is in Lagos (UTC+1). This ensures slots are calculated relative to Host's time.
const HOST_OFFSET = 1; 

interface CalendarEvent {
    start: string;
    end: string;
}

const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
        slots.push(`${i.toString().padStart(2, '0')}:00`);
        slots.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return slots;
};

const allDayTimeSlots = generateTimeSlots();

// --- VIEWS ---
type View = 'calendar' | 'time' | 'form' | 'success' | 'setup_needed';

const SetupNeededView: React.FC = () => (
    <div className="p-6 flex flex-col items-center justify-center h-full text-center text-black dark:text-white">
        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center mb-3">
            <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
        </div>
        <h3 className="font-display text-lg mb-2">Setup Required</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
            The calendar backend is not connected. 
        </p>
        <div className="text-[10px] text-left bg-gray-100 dark:bg-zinc-800 p-3 rounded border border-gray-200 dark:border-zinc-700 w-full font-mono">
            Ensure BACKEND_URL in components/Availability.tsx points to the Google Apps Script Web App URL.
        </div>
    </div>
);

const CalendarView: React.FC<{ 
    onDateSelect: (date: Date) => void; 
    bookedSlots: CalendarEvent[];
    isLoading: boolean;
}> = ({ onDateSelect, bookedSlots, isLoading }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    
    const getDayStatus = (day: number) => {
        if (isLoading) return 'loading';
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (date < today) return 'past';
        if (date.getDay() === 0) return 'sunday';
        
        const dayStartUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).getTime();
        const dayEndUTC = dayStartUTC + 24 * 60 * 60 * 1000;
        
        let totalBookedMinutes = 0;
        
        bookedSlots.forEach(event => {
            const eventStart = new Date(event.start).getTime();
            const eventEnd = new Date(event.end).getTime();
            if (eventStart < dayEndUTC && eventEnd > dayStartUTC) {
                const overlapStart = Math.max(dayStartUTC, eventStart);
                const overlapEnd = Math.min(dayEndUTC, eventEnd);
                totalBookedMinutes += (overlapEnd - overlapStart) / (1000 * 60);
            }
        });
        
        // If more than 6 hours are booked, consider it unavailable
        if (totalBookedMinutes >= 6 * 60) return 'unavailable';
        return 'available';
    };

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const paddingDays = Array.from({ length: startingDay }, () => null);

    return (
        <div className="p-2 flex flex-col h-full relative text-black dark:text-white">
            {isLoading && (
                 <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 z-20 flex items-center justify-center">
                    <Loader2 className="animate-spin text-black dark:text-white" size={24} />
                 </div>
            )}
            <div className="flex justify-between items-center mb-1 md:mb-2 shrink-0">
                <button onClick={handlePrevMonth} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"><ChevronLeft size={14} className="md:w-4 md:h-4" /></button>
                <h3 className="font-display text-xs md:text-sm tracking-wide">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h3>
                <button onClick={handleNextMonth} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"><ChevronRight size={14} className="md:w-4 md:h-4" /></button>
            </div>
            <div className="grid grid-cols-7 text-center text-[8px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-0.5 md:mb-1 shrink-0">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            
            {/* Dynamic Grid: flex-1 ensures it fills remaining height. grid-rows-6 ensures consistency. */}
            <div className="grid grid-cols-7 grid-rows-6 gap-0.5 md:gap-1 flex-1 w-full">
                {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
                {days.map(day => {
                    const status = getDayStatus(day);
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isToday = date.getTime() === today.getTime();
                    const disabled = status === 'past' || status === 'sunday' || status === 'unavailable' || status === 'loading';

                    return (
                        <motion.button
                            key={day}
                            disabled={disabled}
                            onClick={() => onDateSelect(date)}
                            whileHover={{ scale: disabled ? 1 : 1.1 }}
                            whileTap={{ scale: disabled ? 1 : 0.95 }}
                            className={clsx(
                                'w-full h-full flex items-center justify-center text-[10px] md:text-[11px] font-bold transition-all shadow-sm rounded-sm md:rounded-md',
                                {
                                    'text-gray-300 dark:text-gray-600 bg-transparent': status === 'past',
                                    'bg-red-500 text-white': status === 'sunday',
                                    'bg-yellow-500 text-white': status === 'unavailable',
                                    'bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600': status === 'available',
                                    'bg-gray-200 dark:bg-zinc-800 text-gray-500': status === 'loading',
                                    'ring-1 md:ring-2 ring-black dark:ring-white ring-inset': isToday && status === 'available'
                                }
                            )}
                        >
                            {day}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

const TimeSlotView: React.FC<{
    selectedDate: Date;
    userTimeZone: string;
    onTimeSelect: (time: Date) => void;
    onBack: () => void;
    bookedSlots: CalendarEvent[];
}> = ({ selectedDate, userTimeZone, onTimeSelect, onBack, bookedSlots }) => {
    const SLOTS_PER_PAGE = 12;
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(allDayTimeSlots.length / SLOTS_PER_PAGE);
    const displayedSlots = allDayTimeSlots.slice(page * SLOTS_PER_PAGE, (page + 1) * SLOTS_PER_PAGE);
    
    // Helper to check individual slots against the fetched bookedSlots
    const isSlotBooked = (slotStartUTC: Date) => {
        const slotEndUTC = new Date(slotStartUTC.getTime() + 30 * 60000); // 30 mins
        for (const event of bookedSlots) {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            if (slotStartUTC < eventEnd && slotEndUTC > eventStart) {
                return true;
            }
        }
        return false;
    };

    return (
    <div className="p-2 flex flex-col h-full text-black dark:text-white">
        <div className="flex items-center mb-1 shrink-0">
            <button onClick={onBack} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 mr-1"><ArrowLeft size={14} className="md:w-4 md:h-4" /></button>
            <h3 className="font-display text-xs md:text-sm tracking-wide">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
        </div>
        {userTimeZone && (
            <div className="flex items-center justify-center gap-1 text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 mb-1 md:mb-2 font-bold shrink-0">
                <Globe size={10} className="md:w-3 md:h-3"/> 
                Times shown in {userTimeZone.replace(/_/g, ' ')}
            </div>
        )}
        <div className="grid grid-cols-3 gap-1 md:gap-1.5 flex-1 content-start">
            {displayedSlots.map(time => {
                const [hour, minute] = time.split(':').map(Number);
                // Construct UTC date based on Host's Timezone Offset
                const slotStartUTC = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour - HOST_OFFSET, minute));
                
                // Working hours logic based on host time (12:00 PM onwards in Lagos)
                const isWorkingHour = hour >= 12;
                const isBooked = isSlotBooked(slotStartUTC);
                const disabled = !isWorkingHour || isBooked;

                return (
                    <motion.button
                        key={time}
                        disabled={disabled}
                        onClick={() => onTimeSelect(slotStartUTC)}
                        whileHover={{ scale: disabled ? 1 : 1.05 }}
                        whileTap={{ scale: disabled ? 1 : 0.95 }}
                        className={clsx(
                            'p-1 md:p-1.5 rounded-sm md:rounded-md border text-[9px] md:text-[10px] font-bold transition-colors shadow-sm',
                            {
                                'bg-red-500 text-white border-red-600 cursor-not-allowed opacity-50': !isWorkingHour,
                                'bg-yellow-500 text-white border-yellow-600 cursor-not-allowed line-through': isWorkingHour && isBooked,
                                'bg-green-600 dark:bg-green-700 text-white border-green-700 hover:bg-green-700 dark:hover:bg-green-600': isWorkingHour && !isBooked,
                            }
                        )}
                    >
                        {slotStartUTC.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: userTimeZone })}
                    </motion.button>
                );
            })}
        </div>
        <div className="flex items-center justify-between mt-auto pt-1 md:pt-2 shrink-0">
             <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronLeft size={14} className="md:w-4 md:h-4" /></button>
             <span className="text-[9px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400">Page {page + 1} of {totalPages}</span>
             <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronRight size={14} className="md:w-4 md:h-4" /></button>
        </div>
    </div>
    );
};

const BookingFormView: React.FC<{
    selectedSlotUTC: Date;
    userTimeZone: string;
    onSubmit: () => void;
    onBack: () => void;
}> = ({ selectedSlotUTC, userTimeZone, onSubmit, onBack }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target as HTMLFormElement);
        
        const payload = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            purpose: formData.get('purpose') as string,
            duration: formData.get('duration') as string,
            bookingTimeUTC: selectedSlotUTC.toISOString()
        };

        try {
            await fetch(BACKEND_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            // In no-cors mode, we get an opaque response. 
            // We assume if fetch didn't throw, it was received.
            setIsSubmitting(false);
            onSubmit();
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Failed to send booking request. Please check your connection and try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-2 flex flex-col h-full text-black dark:text-white">
            <div className="flex items-center mb-1 shrink-0">
                <button onClick={onBack} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 mr-1"><ArrowLeft size={14} className="md:w-4 md:h-4" /></button>
                <h3 className="font-display text-xs md:text-sm tracking-wide">Confirm Booking</h3>
            </div>
            <p className="text-[9px] md:text-[10px] text-gray-600 dark:text-gray-300 text-center mb-1 md:mb-2 shrink-0">
                {selectedSlotUTC.toLocaleDateString([], { month: 'long', day: 'numeric', timeZone: userTimeZone })}
                {' at '}
                {selectedSlotUTC.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: userTimeZone })}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-1 md:gap-1.5 flex-1 min-h-0">
                <input required name="name" type="text" placeholder="Your Name" className="w-full p-1 border border-gray-300 dark:border-zinc-600 rounded-sm md:rounded-md text-[10px] md:text-[11px] font-body bg-white dark:bg-zinc-800 text-black dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" />
                <input required name="email" type="email" placeholder="Your Email" className="w-full p-1 border border-gray-300 dark:border-zinc-600 rounded-sm md:rounded-md text-[10px] md:text-[11px] font-body bg-white dark:bg-zinc-800 text-black dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" />
                <textarea required name="purpose" placeholder="Purpose of meeting" rows={2} className="w-full p-1 border border-gray-300 dark:border-zinc-600 rounded-sm md:rounded-md text-[10px] md:text-[11px] resize-none font-body bg-white dark:bg-zinc-800 text-black dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none flex-1"></textarea>
                <select required name="duration" className="w-full p-1 border border-gray-300 dark:border-zinc-600 rounded-sm md:rounded-md text-[10px] md:text-[11px] bg-white dark:bg-zinc-800 text-black dark:text-white font-body focus:ring-1 focus:ring-black dark:focus:ring-white outline-none shrink-0">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                </select>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-auto w-full flex items-center justify-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-md font-body text-[10px] md:text-xs hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:bg-gray-400 shadow-[2px_2px_2px_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-[1px] shrink-0"
                >
                    {isSubmitting ? 'Sending...' : 'Confirm'} <Send size={12} />
                </button>
            </form>
        </div>
    );
};

const SuccessView: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="p-4 flex flex-col items-center justify-center h-full text-center text-black dark:text-white">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-3 mx-auto">
                <Send className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h3 className="font-display text-lg">Request Sent!</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 mb-3">I'll get back to you via email shortly to confirm your booking.</p>
            <button onClick={onReset} className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-md font-body text-xs hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-[2px_2px_2px_rgba(0,0,0,0.15)]">
                Done
            </button>
        </motion.div>
    </div>
);

export const Availability: React.FC = () => {
    const [view, setView] = useState<View>('calendar');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlotUTC, setSelectedSlotUTC] = useState<Date | null>(null);
    const [userTimeZone, setUserTimeZone] = useState<string>('');
    const [bookedSlots, setBookedSlots] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Explicitly detect user timezone on mount
        try {
            const detectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setUserTimeZone(detectedZone || 'UTC');
        } catch (e) {
            console.warn("Timezone detection failed, defaulting to UTC");
            setUserTimeZone('UTC');
        }

        if (!BACKEND_URL) {
            setView('setup_needed');
            setIsLoading(false);
            return;
        }

        const fetchAvailability = async () => {
            try {
                // Ensure redirects are followed (standard behavior, but explicit for clarity with Apps Script)
                const response = await fetch(BACKEND_URL, { redirect: 'follow' });
                if (response.ok) {
                    const data = await response.json();
                    setBookedSlots(data);
                } else {
                    console.warn("Backend error: " + response.statusText);
                }
            } catch (e) {
                console.error("Error connecting to calendar backend:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailability();
    }, []);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setView('time');
    };

    const handleTimeSelect = (slotUTC: Date) => {
        setSelectedSlotUTC(slotUTC);
        setView('form');
    };

    const handleFormSubmit = () => {
        setView('success');
    };

    const reset = () => {
        setView('calendar');
        setSelectedDate(null);
        setSelectedSlotUTC(null);
    };

    return (
        <Card className="h-full" title="Book a Call" noPadding>
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="h-full w-full"
                >
                    {view === 'calendar' && <CalendarView onDateSelect={handleDateSelect} bookedSlots={bookedSlots} isLoading={isLoading} />}
                    {view === 'time' && selectedDate && <TimeSlotView selectedDate={selectedDate} userTimeZone={userTimeZone} onTimeSelect={handleTimeSelect} onBack={() => setView('calendar')} bookedSlots={bookedSlots} />}
                    {view === 'form' && selectedSlotUTC && <BookingFormView selectedSlotUTC={selectedSlotUTC} userTimeZone={userTimeZone} onSubmit={handleFormSubmit} onBack={() => setView('time')} />}
                    {view === 'success' && <SuccessView onReset={reset} />}
                    {view === 'setup_needed' && <SetupNeededView />}
                </motion.div>
            </AnimatePresence>
        </Card>
    );
};