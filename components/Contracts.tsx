
import React, { useState, useEffect, useMemo } from 'react';
import { Contract, Client, Project, Profile } from '../types';
import { contractService } from '../services/database';
import PageHeader from './PageHeader';
import Modal from './Modal';
import { PlusIcon, PencilIcon, Trash2Icon, EyeIcon, FileTextIcon } from '../constants';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

interface ContractsProps {
    contracts: Contract[];
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
    clients: Client[];
    projects: Project[];
    profile: Profile;
    showNotification: (message: string) => void;
}

const initialFormState = {
    contractNumber: '',
    clientId: '',
    projectId: '',
    signingDate: new Date().toISOString().split('T')[0],
    signingLocation: '',
    clientName1: '',
    clientAddress1: '',
    clientPhone1: '',
    clientName2: '',
    clientAddress2: '',
    clientPhone2: '',
    shootingDuration: '',
    guaranteedPhotos: '',
    albumDetails: '',
    digitalFilesFormat: '',
    otherItems: '',
    personnelCount: '',
    deliveryTimeframe: '',
    dpDate: new Date().toISOString().split('T')[0],
    finalPaymentDate: new Date().toISOString().split('T')[0],
    cancellationPolicy: '',
    jurisdiction: ''
};

const Contracts: React.FC<ContractsProps> = ({ 
    contracts, setContracts, clients, projects, profile, showNotification 
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);

    // Load contracts on component mount
    useEffect(() => {
        loadContracts();
    }, []);

    const loadContracts = async () => {
        try {
            setIsLoading(true);
            const data = await contractService.getAll();
            setContracts(data);
        } catch (error) {
            console.error('Error loading contracts:', error);
            showNotification('Gagal memuat data kontrak');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (mode: 'add' | 'edit' | 'view', contract?: Contract) => {
        setModalMode(mode);
        if (contract) {
            setSelectedContract(contract);
            setFormData({
                contractNumber: contract.contractNumber,
                clientId: contract.clientId,
                projectId: contract.projectId,
                signingDate: contract.signingDate,
                signingLocation: contract.signingLocation,
                clientName1: contract.clientName1,
                clientAddress1: contract.clientAddress1,
                clientPhone1: contract.clientPhone1,
                clientName2: contract.clientName2 || '',
                clientAddress2: contract.clientAddress2 || '',
                clientPhone2: contract.clientPhone2 || '',
                shootingDuration: contract.shootingDuration,
                guaranteedPhotos: contract.guaranteedPhotos,
                albumDetails: contract.albumDetails,
                digitalFilesFormat: contract.digitalFilesFormat,
                otherItems: contract.otherItems,
                personnelCount: contract.personnelCount,
                deliveryTimeframe: contract.deliveryTimeframe,
                dpDate: contract.dpDate,
                finalPaymentDate: contract.finalPaymentDate,
                cancellationPolicy: contract.cancellationPolicy,
                jurisdiction: contract.jurisdiction
            });
        } else {
            setSelectedContract(null);
            setFormData({
                ...initialFormState,
                contractNumber: `CTR-${Date.now()}`
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedContract(null);
        setFormData(initialFormState);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            
            if (modalMode === 'add') {
                const newContract = await contractService.create({
                    contractNumber: formData.contractNumber,
                    clientId: formData.clientId,
                    projectId: formData.projectId,
                    signingDate: formData.signingDate,
                    signingLocation: formData.signingLocation,
                    clientName1: formData.clientName1,
                    clientAddress1: formData.clientAddress1,
                    clientPhone1: formData.clientPhone1,
                    clientName2: formData.clientName2 || undefined,
                    clientAddress2: formData.clientAddress2 || undefined,
                    clientPhone2: formData.clientPhone2 || undefined,
                    shootingDuration: formData.shootingDuration,
                    guaranteedPhotos: formData.guaranteedPhotos,
                    albumDetails: formData.albumDetails,
                    digitalFilesFormat: formData.digitalFilesFormat,
                    otherItems: formData.otherItems,
                    personnelCount: formData.personnelCount,
                    deliveryTimeframe: formData.deliveryTimeframe,
                    dpDate: formData.dpDate,
                    finalPaymentDate: formData.finalPaymentDate,
                    cancellationPolicy: formData.cancellationPolicy,
                    jurisdiction: formData.jurisdiction,
                    createdAt: new Date().toISOString()
                });
                setContracts(prev => [newContract, ...prev]);
                showNotification('Kontrak berhasil ditambahkan');
            } else if (modalMode === 'edit' && selectedContract) {
                const updatedContract = await contractService.update(selectedContract.id, {
                    contractNumber: formData.contractNumber,
                    clientId: formData.clientId,
                    projectId: formData.projectId,
                    signingDate: formData.signingDate,
                    signingLocation: formData.signingLocation,
                    clientName1: formData.clientName1,
                    clientAddress1: formData.clientAddress1,
                    clientPhone1: formData.clientPhone1,
                    clientName2: formData.clientName2 || undefined,
                    clientAddress2: formData.clientAddress2 || undefined,
                    clientPhone2: formData.clientPhone2 || undefined,
                    shootingDuration: formData.shootingDuration,
                    guaranteedPhotos: formData.guaranteedPhotos,
                    albumDetails: formData.albumDetails,
                    digitalFilesFormat: formData.digitalFilesFormat,
                    otherItems: formData.otherItems,
                    personnelCount: formData.personnelCount,
                    deliveryTimeframe: formData.deliveryTimeframe,
                    dpDate: formData.dpDate,
                    finalPaymentDate: formData.finalPaymentDate,
                    cancellationPolicy: formData.cancellationPolicy,
                    jurisdiction: formData.jurisdiction
                });
                setContracts(prev => prev.map(c => c.id === selectedContract.id ? updatedContract : c));
                showNotification('Kontrak berhasil diperbarui');
            }
            
            handleCloseModal();
        } catch (error) {
            console.error('Error saving contract:', error);
            showNotification('Gagal menyimpan kontrak');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (contractId: string) => {
        if (window.confirm('Yakin ingin menghapus kontrak ini?')) {
            try {
                setIsLoading(true);
                await contractService.delete(contractId);
                setContracts(prev => prev.filter(c => c.id !== contractId));
                showNotification('Kontrak berhasil dihapus');
            } catch (error) {
                console.error('Error deleting contract:', error);
                showNotification('Gagal menghapus kontrak');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Manajemen Kontrak" 
                subtitle="Kelola semua kontrak kerja dengan klien"
            >
                <button 
                    onClick={() => handleOpenModal('add')} 
                    className="button-primary inline-flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    TAMBAH KONTRAK
                </button>
            </PageHeader>

            <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-input">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text-primary">No. Kontrak</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text-primary">Klien</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text-primary">Proyek</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text-primary">Tanggal</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text-primary">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-brand-text-primary">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {contracts.map(contract => {
                                const client = clients.find(c => c.id === contract.clientId);
                                const project = projects.find(p => p.id === contract.projectId);
                                const isSigned = contract.clientSignature && contract.vendorSignature;
                                
                                return (
                                    <tr key={contract.id} className="hover:bg-brand-input/50">
                                        <td className="px-6 py-4 font-medium text-brand-text-light">
                                            {contract.contractNumber}
                                        </td>
                                        <td className="px-6 py-4 text-brand-text-primary">
                                            {client?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-brand-text-primary">
                                            {project?.projectName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-brand-text-secondary">
                                            {formatDate(contract.signingDate)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                isSigned ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {isSigned ? 'Ditandatangani' : 'Belum Lengkap'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal('view', contract)}
                                                    className="p-2 text-brand-text-secondary hover:text-blue-400 transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal('edit', contract)}
                                                    className="p-2 text-brand-text-secondary hover:text-yellow-400 transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contract.id)}
                                                    className="p-2 text-brand-text-secondary hover:text-red-400 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalMode === 'add' ? 'Tambah Kontrak Baru' : modalMode === 'edit' ? 'Edit Kontrak' : 'Detail Kontrak'}
                size="4xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-group">
                            <input
                                type="text"
                                name="contractNumber"
                                value={formData.contractNumber}
                                onChange={handleFormChange}
                                className="input-field"
                                placeholder=" "
                                required
                                disabled={modalMode === 'view'}
                            />
                            <label className="input-label">Nomor Kontrak</label>
                        </div>
                        
                        <div className="input-group">
                            <select
                                name="clientId"
                                value={formData.clientId}
                                onChange={handleFormChange}
                                className="input-field"
                                required
                                disabled={modalMode === 'view'}
                            >
                                <option value="">Pilih Klien</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                            <label className="input-label">Klien</label>
                        </div>

                        <div className="input-group">
                            <select
                                name="projectId"
                                value={formData.projectId}
                                onChange={handleFormChange}
                                className="input-field"
                                required
                                disabled={modalMode === 'view'}
                            >
                                <option value="">Pilih Proyek</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>{project.projectName}</option>
                                ))}
                            </select>
                            <label className="input-label">Proyek</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="date"
                                name="signingDate"
                                value={formData.signingDate}
                                onChange={handleFormChange}
                                className="input-field"
                                placeholder=" "
                                required
                                disabled={modalMode === 'view'}
                            />
                            <label className="input-label">Tanggal Penandatanganan</label>
                        </div>

                        <div className="input-group md:col-span-2">
                            <input
                                type="text"
                                name="signingLocation"
                                value={formData.signingLocation}
                                onChange={handleFormChange}
                                className="input-field"
                                placeholder=" "
                                required
                                disabled={modalMode === 'view'}
                            />
                            <label className="input-label">Lokasi Penandatanganan</label>
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
        </div>
    );
};

export default Contracts;
