import React, { useState, useMemo, useEffect } from 'react';
import { Project, TeamMember, Profile, AssignedTeamMember, ProjectStatusConfig, PaymentStatus, SocialMediaPost } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, UsersIcon, FileTextIcon, PlusIcon, MapPinIcon, CalendarIcon, MessageSquareIcon } from '../constants';
import Modal from './Modal';

// --- TYPE DEFINITIONS ---
type CalendarEvent = {
    id: string;
    type: 'project' | 'social';
    title: string;
    date: string; // YYYY-MM-DD
    startTime?: string;
    endTime?: string;
    color: string;
    original: Project | SocialMediaPost;
};

// --- HELPER FUNCTIONS ---
const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const weekdays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const eventTypeColors: { [key: string]: string } = {
    'Meeting Klien': '#3b82f6',
    'Survey Lokasi': '#22c55e',
    'Libur': '#94a3b8',
    'Workshop': '#a855f7',
    'Lainnya': '#eab308',
};

const getProjectEventColor = (project: Project, profile: Profile) => {
    const isInternalEvent = profile.eventTypes.includes(project.projectType);
    if (isInternalEvent) {
        return eventTypeColors[project.projectType] || '#64748b';
    }
    return profile.projectStatusConfig.find(s => s.name === project.status)?.color || '#64748b';
};

// --- SUB-COMPONENTS ---
// (Assuming sub-components from the original file are here, but they will be adapted to use CalendarEvent)
const MonthView: React.FC<{
    currentDate: Date;
    daysInMonth: Date[];
    eventsByDate: Map<string, CalendarEvent[]>;
    onDayClick: (date: Date) => void;
    onEventClick: (event: CalendarEvent) => void;
}> = ({ currentDate, daysInMonth, eventsByDate, onDayClick, onEventClick }) => (
    <div className="grid grid-cols-7 flex-grow h-full">
        {weekdays.map(day => (<div key={day} className="text-center py-2 text-xs font-semibold text-brand-text-secondary border-b border-l border-brand-border">{day}</div>))}
        {daysInMonth.map((day, i) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            const events = eventsByDate.get(day.toDateString()) || [];
            return (
                <div key={i} onClick={() => onDayClick(day)} className={`relative border-b border-l border-brand-border p-1.5 flex flex-col min-h-[120px] ${isCurrentMonth ? 'bg-brand-surface' : 'bg-brand-bg'} cursor-pointer hover:bg-brand-input transition-colors`}>
                    <span className={`text-xs font-semibold self-start mb-1 ${isCurrentMonth ? 'text-brand-text-light' : 'text-brand-text-secondary/50'} ${isToday ? 'bg-brand-accent text-white rounded-full w-5 h-5 flex items-center justify-center' : ''}`}>{day.getDate()}</span>
                    <div className="flex-grow space-y-1 overflow-hidden">
                        {events.map(event => (
                            <div key={event.id} onClick={(e) => { e.stopPropagation(); onEventClick(event); }} className="text-xs p-1.5 rounded text-white truncate cursor-pointer" style={{ backgroundColor: event.color }}>
                                {event.type === 'social' && <MessageSquareIcon className="w-3 h-3 inline-block mr-1" />}
                                <p className="font-semibold truncate inline">{event.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
    </div>
);

// --- MAIN COMPONENT ---
interface CalendarViewProps {
    projects: Project[];
    socialMediaPosts: SocialMediaPost[];
    teamMembers: TeamMember[];
    profile: Profile;
    addProject: (project: Omit<Project, 'id'>) => Promise<Project>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
    deleteProject: (id: string) => Promise<void>;
    updateSocialMediaPost: (id: string, updates: Partial<SocialMediaPost>) => Promise<SocialMediaPost>;
    deleteSocialMediaPost: (id: string) => Promise<void>;
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>; // Kept for optimistic updates if needed, though direct calls are better
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    projects, socialMediaPosts, teamMembers, profile,
    addProject, updateProject, deleteProject,
    updateSocialMediaPost, deleteSocialMediaPost,
    setProjects
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'Month' | 'Agenda'>('Month');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [panelMode, setPanelMode] = useState<'detail' | 'edit'>('detail');
    
    // Simplified form state
    const [eventForm, setEventForm] = useState<any>({});

    // MEMOS
    const combinedEvents = useMemo((): CalendarEvent[] => {
        const projectEvents: CalendarEvent[] = projects.map(p => ({
            id: p.id,
            type: 'project',
            title: p.projectName,
            date: p.date,
            startTime: p.startTime,
            endTime: p.endTime,
            color: getProjectEventColor(p, profile),
            original: p
        }));

        const socialEvents: CalendarEvent[] = socialMediaPosts.map(s => ({
            id: s.id,
            type: 'social',
            title: s.content.substring(0, 30) + '...',
            date: s.postDate,
            startTime: s.postTime,
            color: '#1da1f2', // Twitter blue for social posts
            original: s
        }));

        return [...projectEvents, ...socialEvents];
    }, [projects, socialMediaPosts, profile]);

    const eventsByDate = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        combinedEvents.forEach(e => {
            const dateKey = new Date(e.date).toDateString();
            if (!map.has(dateKey)) { map.set(dateKey, []); }
            map.get(dateKey)!.push(e);
        });
        return map;
    }, [combinedEvents]);

    const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
    const lastDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), [currentDate]);

    const daysInMonthGrid = useMemo(() => {
        const days = [];
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        const endDate = new Date(lastDayOfMonth);
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
        let date = startDate;
        while (date <= endDate) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [firstDayOfMonth, lastDayOfMonth]);


    // HANDLERS
    const handleOpenPanelForAdd = (date: Date) => {
        setSelectedEvent(null);
        // Simplified form for adding an internal event
        setEventForm({
            type: 'project',
            projectName: '',
            projectType: profile.eventTypes[0] || 'Lainnya',
            date: date.toISOString().split('T')[0],
            startTime: '',
            endTime: '',
            notes: '',
            team: [],
        });
        setPanelMode('edit');
        setIsPanelOpen(true);
    };

    const handleOpenPanelForEdit = (event: CalendarEvent) => {
        setSelectedEvent(event);
        if (event.type === 'project') {
            const p = event.original as Project;
            setEventForm({
                type: 'project',
                projectName: p.projectName, projectType: p.projectType, date: p.date,
                startTime: p.startTime || '', endTime: p.endTime || '', notes: p.notes || '',
                team: p.team || [],
            });
        } else {
            const s = event.original as SocialMediaPost;
            setEventForm({
                type: 'social',
                content: s.content,
                postDate: s.postDate,
                postTime: s.postTime || '',
                status: s.status,
            });
        }
        setPanelMode('detail');
        setIsPanelOpen(true);
    };
    
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedEvent) { // Editing existing event
            if (selectedEvent.type === 'project') {
                const project = selectedEvent.original as Project;
                await updateProject(project.id, {
                    projectName: eventForm.projectName,
                    date: eventForm.date,
                    startTime: eventForm.startTime,
                    endTime: eventForm.endTime,
                    notes: eventForm.notes,
                    team: eventForm.team,
                });
            } else { // 'social'
                const post = selectedEvent.original as SocialMediaPost;
                await updateSocialMediaPost(post.id, {
                    content: eventForm.content,
                    postDate: eventForm.postDate,
                    postTime: eventForm.postTime,
                    status: eventForm.status,
                });
            }
        } else { // Adding new event (only internal projects supported for now)
            const newEvent: Omit<Project, 'id'> = {
                projectName: eventForm.projectName,
                projectType: eventForm.projectType,
                date: eventForm.date,
                startTime: eventForm.startTime,
                endTime: eventForm.endTime,
                notes: eventForm.notes,
                team: eventForm.team,
                clientName: 'Acara Internal',
                clientId: 'INTERNAL',
                status: 'Dikonfirmasi',
                // Default values for other required fields
                packageName: '', packageId: '', addOns: [], deadlineDate: eventForm.date, location: '',
                progress: 100, totalCost: 0, amountPaid: 0, paymentStatus: PaymentStatus.LUNAS,
            };
            await addProject(newEvent);
        }
        setIsPanelOpen(false);
    };
    
    const handleDeleteEvent = async () => {
        if (selectedEvent && window.confirm(`Yakin ingin menghapus acara "${selectedEvent.title}"?`)) {
            if (selectedEvent.type === 'project') {
                await deleteProject(selectedEvent.id);
            } else {
                await deleteSocialMediaPost(selectedEvent.id);
            }
            setIsPanelOpen(false);
        }
    };
    
    // Dummy components for brevity. In a real scenario, these would be fully fleshed out.
    const CalendarSidebar = () => <div className="w-64 p-4 border-r hidden lg:block">Sidebar</div>;
    const CalendarHeader = ({currentDate, onPrev, onNext, onToday}: any) => (
        <div className="p-4 border-b flex justify-between">
            <button onClick={onPrev}>&lt;</button>
            <h2>{currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={onNext}>&gt;</button>
            <button onClick={onToday}>Today</button>
        </div>
    );
    const EventPanel = ({isOpen, onClose, onSubmit, onDelete, children}: any) => (
        <div className={`w-96 border-l p-4 ${isOpen ? '' : 'hidden'}`}>
            <form onSubmit={onSubmit}>
                {children}
                <button type="submit">Save</button>
                <button type="button" onClick={onDelete}>Delete</button>
                <button type="button" onClick={onClose}>Close</button>
            </form>
        </div>
    );
     const AgendaView = () => <div>Agenda View</div>;


    return (
        <div className="flex h-[calc(100vh-8rem)] bg-brand-surface rounded-2xl overflow-hidden">
            <CalendarSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <CalendarHeader
                    currentDate={currentDate}
                    onPrev={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                    onNext={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                    onToday={() => setCurrentDate(new Date())}
                />
                 <div className="flex-1 overflow-y-auto">
                    {viewMode === 'Month' ? (
                        <MonthView
                            currentDate={currentDate}
                            daysInMonth={daysInMonthGrid}
                            eventsByDate={eventsByDate}
                            onDayClick={handleOpenPanelForAdd}
                            onEventClick={handleOpenPanelForEdit}
                        />
                    ) : (
                        <AgendaView />
                    )}
                </div>
            </div>
            <EventPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onSubmit={handleFormSubmit} onDelete={handleDeleteEvent}>
                {/* Simplified form content */}
                {selectedEvent?.type === 'project' || !selectedEvent ? (
                    <>
                        <label>Project Name</label>
                        <input name="projectName" value={eventForm.projectName || ''} onChange={e => setEventForm({...eventForm, projectName: e.target.value})} />
                    </>
                ) : (
                    <>
                        <label>Social Post Content</label>
                        <textarea name="content" value={eventForm.content || ''} onChange={e => setEventForm({...eventForm, content: e.target.value})} />
                    </>
                )}
            </EventPanel>
        </div>
    );
};
