
import React, { useState, useEffect, useMemo } from 'react';
import { TeamMember, Profile } from '../types';
import { teamMemberService } from '../services/database';
import PageHeader from './PageHeader';
import Modal from './Modal';
import { PlusIcon, PencilIcon, Trash2Icon, EyeIcon, Share2Icon, QrCodeIcon } from '../constants';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

interface TeamProps {
    teamMembers: TeamMember[];
    setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
    profile: Profile;
    showNotification: (message: string) => void;
}

const initialFormState = {
    name: '',
    role: '',
    email: '',
    phone: '',
    standardFee: 0,
    noRek: ''
};

const Team: React.FC<TeamProps> = ({ 
    teamMembers, setTeamMembers, profile, showNotification 
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [isPortalShareModalOpen, setIsPortalShareModalOpen] = useState(false);
    const [memberForPortal, setMemberForPortal] = useState<TeamMember | null>(null);

    // Load team members on component mount
    useEffect(() => {
        loadTeamMembers();
    }, []);

    const loadTeamMembers = async () => {
        try {
            setIsLoading(true);
            const data = await teamMemberService.getAll();
            setTeamMembers(data);
        } catch (error) {
            console.error('Error loading team members:', error);
            showNotification('Gagal memuat data tim');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (mode: 'add' | 'edit' | 'view', member?: TeamMember) => {
        setModalMode(mode);
        if (member) {
            setSelectedMember(member);
            setFormData({
                name: member.name,
                role: member.role,
                email: member.email,
                phone: member.phone,
                standardFee: member.standardFee,
                noRek: member.noRek || ''
            });
        } else {
            setSelectedMember(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
        setFormData(initialFormState);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? Number(value) : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            
            if (modalMode === 'add') {
                const newMember = await teamMemberService.create({
                    ...formData,
                    rewardBalance: 0,
                    rating: 0,
                    performanceNotes: [],
                    portalAccessId: crypto.randomUUID()
                });
                setTeamMembers(prev => [newMember, ...prev]);
                showNotification('Anggota tim berhasil ditambahkan');
            } else if (modalMode === 'edit' && selectedMember) {
                const updatedMember = await teamMemberService.update(selectedMember.id, formData);
                setTeamMembers(prev => prev.map(m => m.id === selectedMember.id ? updatedMember : m));
                showNotification('Data anggota tim berhasil diperbarui');
            }
            
            handleCloseModal();
        } catch (error) {
            console.error('Error saving team member:', error);
            showNotification('Gagal menyimpan data anggota tim');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (memberId: string) => {
        if (window.confirm('Yakin ingin menghapus anggota tim ini?')) {
            try {
                setIsLoading(true);
                await teamMemberService.delete(memberId);
                setTeamMembers(prev => prev.filter(m => m.id !== memberId));
                showNotification('Anggota tim berhasil dihapus');
            } catch (error) {
                console.error('Error deleting team member:', error);
                showNotification('Gagal menghapus anggota tim');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSharePortal = (member: TeamMember) => {
        setMemberForPortal(member);
        setIsPortalShareModalOpen(true);
    };

    const portalUrl = useMemo(() => {
        if (!memberForPortal) return '';
        return `${window.location.origin}${window.location.pathname}#/freelancer-portal/${memberForPortal.portalAccessId}`;
    }, [memberForPortal]);

    const copyPortalUrl = () => {
        navigator.clipboard.writeText(portalUrl).then(() => {
            showNotification('Link portal berhasil disalin!');
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Manajemen Tim" 
                subtitle="Kelola semua anggota tim dan freelancer"
            >
                <button 
                    onClick={() => handleOpenModal('add')} 
                    className="button-primary inline-flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    TAMBAH ANGGOTA TIM
                </button>
            </PageHeader>

            <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-input">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text-primary">Nama</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text-primary">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text-primary">Kontak</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text-primary">Fee Standar</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text-primary">Rating</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-brand-text-primary">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {teamMembers.map(member => (
                                <tr key={member.id} className="hover:bg-brand-input/50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-brand-text-light">{member.name}</div>
                                            <div className="text-sm text-brand-text-secondary">{member.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-brand-text-primary">{member.role}</td>
                                    <td className="px-6 py-4 text-brand-text-secondary">{member.phone}</td>
                                    <td className="px-6 py-4 text-brand-text-primary">{formatCurrency(member.standardFee)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-brand-text-primary">{member.rating.toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleOpenModal('view', member)}
                                                className="p-2 text-brand-text-secondary hover:text-blue-400 transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal('edit', member)}
                                                className="p-2 text-brand-text-secondary hover:text-yellow-400 transition-colors"
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleSharePortal(member)}
                                                className="p-2 text-brand-text-secondary hover:text-green-400 transition-colors"
                                                title="Bagikan Portal"
                                            >
                                                <Share2Icon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 text-brand-text-secondary hover:text-red-400 transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2Icon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalMode === 'add' ? 'Tambah Anggota Tim' : modalMode === 'edit' ? 'Edit Anggota Tim' : 'Detail Anggota Tim'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-group">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                className="input-field"
                                placeholder=" "
                                required
                                disabled={modalMode === 'view'}
                            />
                            <label className="input-label">Nama Lengkap</label>
                        </div>
                        
                        <div className="input-group">
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleFormChange}
                                className="input-field"
                                placeholder=" "
                                required
                                disabled={modalMode === 'view'}
                            />
                            <label className="input-label">Role/Posisi</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                className="input-field"
                                placeholder=" "
                                required
                                disabled={modalMode === 'view'}
                            />
                            <label className="input-label">Email</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormChange}
                                className="input-field"
                                placeholder=" "
                                required
                                disabled={modalMode === 'view'}
                            />
                            <label className="input-label">Nomor Telepon</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="number"
                                name="standardFee"
                                value={formData.standardFee}
                                onChange={handleFormChange}
                                className="input-field"
                                placeholder=" "
                                min="0"
                                disabled={modalMode === 'view'}
                            />
                            <label className="input-label">Fee Standar</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                name="noRek"
                                value={formData.noRek}
                                onChange={handleFormChange}
                                className="input-field"
                                placeholder=" "
                                disabled={modalMode === 'view'}
                            />
                            <label className="input-label">Nomor Rekening</label>
                        </div>
                    </div>

                    {modalMode !== 'view' && (
                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="button-secondary"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="button-primary"
                            >
                                {isLoading ? 'Menyimpan...' : modalMode === 'add' ? 'Tambah' : 'Simpan'}
                            </button>
                        </div>
                    )}
                </form>
            </Modal>

            {/* Portal Share Modal */}
            <Modal
                isOpen={isPortalShareModalOpen}
                onClose={() => setIsPortalShareModalOpen(false)}
                title={`Portal Freelancer: ${memberForPortal?.name}`}
            >
                <div className="space-y-4">
                    <p className="text-brand-text-secondary">
                        Bagikan link portal ini kepada {memberForPortal?.name} untuk akses ke portal freelancer.
                    </p>
                    
                    <div className="p-4 bg-brand-input rounded-lg">
                        <p className="text-sm font-medium text-brand-text-primary mb-2">Link Portal:</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={portalUrl}
                                readOnly
                                className="flex-1 p-2 text-sm bg-brand-bg border border-brand-border rounded"
                            />
                            <button
                                onClick={copyPortalUrl}
                                className="button-secondary text-sm"
                            >
                                Salin
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Team;
