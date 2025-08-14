import { useState, useEffect } from 'react'
import { 
  userService, clientService, projectService, transactionService, teamMemberService, 
  packageService, addOnService, leadService, cardService, financialPocketService, 
  contractService, assetService, clientFeedbackService, notificationService, 
  socialMediaPostService, promoCodeService, sopService, profileService,
  teamPaymentRecordService, teamProjectPaymentService, rewardLedgerService
} from '../services/database'
import type { 
  User, Client, Project, Transaction, TeamMember, Package, AddOn, Lead, 
  Card, FinancialPocket, Contract, Asset, ClientFeedback, Notification,
  SocialMediaPost, PromoCode, SOP, Profile, TeamProjectPayment, TeamPaymentRecord,
  RewardLedgerEntry
} from '../types'

export const useDatabase = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for all data
  const [users, setUsers] = useState<User[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [addOns, setAddOns] = useState<AddOn[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [pockets, setPockets] = useState<FinancialPocket[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [clientFeedback, setClientFeedback] = useState<ClientFeedback[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>([])
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [sops, setSops] = useState<SOP[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [teamProjectPayments, setTeamProjectPayments] = useState<TeamProjectPayment[]>([])
  const [teamPaymentRecords, setTeamPaymentRecords] = useState<TeamPaymentRecord[]>([])
  const [rewardLedgerEntries, setRewardLedgerEntries] = useState<RewardLedgerEntry[]>([])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Loading data from Supabase...')

      // Load all data in parallel
      const [
        usersData,
        clientsData,
        projectsData,
        transactionsData,
        teamMembersData,
        packagesData,
        addOnsData,
        leadsData,
        cardsData,
        pocketsData,
        contractsData,
        assetsData,
        clientFeedbackData,
        notificationsData,
        socialMediaPostsData,
        promoCodesData,
        sopsData,
        profileData,
        teamProjectPaymentsData,
        teamPaymentRecordsData,
        rewardLedgerEntriesData
      ] = await Promise.all([
        userService.getAll().catch(err => { console.warn('Failed to load users:', err); return [] }),
        clientService.getAll().catch(err => { console.warn('Failed to load clients:', err); return [] }),
        projectService.getAll().catch(err => { console.warn('Failed to load projects:', err); return [] }),
        transactionService.getAll().catch(err => { console.warn('Failed to load transactions:', err); return [] }),
        teamMemberService.getAll().catch(err => { console.warn('Failed to load team members:', err); return [] }),
        packageService.getAll().catch(err => { console.warn('Failed to load packages:', err); return [] }),
        addOnService.getAll().catch(err => { console.warn('Failed to load add-ons:', err); return [] }),
        leadService.getAll().catch(err => { console.warn('Failed to load leads:', err); return [] }),
        cardService.getAll().catch(err => { console.warn('Failed to load cards:', err); return [] }),
        financialPocketService.getAll().catch(err => { console.warn('Failed to load pockets:', err); return [] }),
        contractService.getAll().catch(err => { console.warn('Failed to load contracts:', err); return [] }),
        assetService.getAll().catch(err => { console.warn('Failed to load assets:', err); return [] }),
        clientFeedbackService.getAll().catch(err => { console.warn('Failed to load feedback:', err); return [] }),
        notificationService.getAll().catch(err => { console.warn('Failed to load notifications:', err); return [] }),
        socialMediaPostService.getAll().catch(err => { console.warn('Failed to load social posts:', err); return [] }),
        promoCodeService.getAll().catch(err => { console.warn('Failed to load promo codes:', err); return [] }),
        sopService.getAll().catch(err => { console.warn('Failed to load SOPs:', err); return [] }),
        profileService.get().catch(err => { console.warn('Failed to load profile:', err); return null }),
        teamProjectPaymentService.getAll().catch(err => { console.warn('Failed to load team project payments:', err); return [] }),
        teamPaymentRecordService.getAll().catch(err => { console.warn('Failed to load team payment records:', err); return [] }),
        rewardLedgerService.getAll().catch(err => { console.warn('Failed to load reward ledger entries:', err); return [] })
      ])

      // Set all data
      setUsers(usersData)
      setClients(clientsData)
      setProjects(projectsData)
      setTransactions(transactionsData)
      setTeamMembers(teamMembersData)
      setPackages(packagesData)
      setAddOns(addOnsData)
      setLeads(leadsData)
      setCards(cardsData)
      setPockets(pocketsData)
      setContracts(contractsData)
      setAssets(assetsData)
      setClientFeedback(clientFeedbackData)
      setNotifications(notificationsData)
      setSocialMediaPosts(socialMediaPostsData)
      setPromoCodes(promoCodesData)
      setSops(sopsData)
      setProfile(profileData)
      setTeamProjectPayments(teamProjectPaymentsData)
      setTeamPaymentRecords(teamPaymentRecordsData)
      setRewardLedgerEntries(rewardLedgerEntriesData)

      console.log('Data loaded successfully:', {
        users: usersData.length,
        clients: clientsData.length,
        projects: projectsData.length,
        transactions: transactionsData.length,
        teamMembers: teamMembersData.length,
        packages: packagesData.length,
        profile: profileData ? 'Found' : 'Not found'
      })

    } catch (err) {
      console.error('Failed to load data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  // Generic handler for creating data
  const createItem = async <T>(serviceCall: Promise<T>, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    try {
      const newItem = await serviceCall
      setter(prev => [...prev, newItem])
      return newItem
    } catch (err) {
      console.error('Failed to create item:', err)
      setError(err instanceof Error ? err.message : 'Failed to create item')
      throw err
    }
  }

  // Generic handler for updating data
  const updateItem = async <T extends { id: string }>(serviceCall: Promise<T>, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    try {
      const updatedItem = await serviceCall
      setter(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item))
      return updatedItem
    } catch (err) {
      console.error('Failed to update item:', err)
      setError(err instanceof Error ? err.message : 'Failed to update item')
      throw err
    }
  }

  // Generic handler for deleting data
  const deleteItem = async <T extends { id: string }>(id: string, serviceCall: Promise<void>, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    try {
      await serviceCall
      setter(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error('Failed to delete item:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      throw err
    }
  }

  return {
    loading,
    error,
    users, setUsers,
    clients, setClients,
    projects, setProjects,
    transactions, setTransactions,
    teamMembers, setTeamMembers,
    packages, setPackages,
    addOns, setAddOns,
    leads, setLeads,
    cards, setCards,
    pockets, setPockets,
    contracts, setContracts,
    assets, setAssets,
    clientFeedback, setClientFeedback,
    notifications, setNotifications,
    socialMediaPosts, setSocialMediaPosts,
    promoCodes, setPromoCodes,
    sops, setSops,
    profile, setProfile,
    teamProjectPayments, setTeamProjectPayments,
    teamPaymentRecords, setTeamPaymentRecords,
    rewardLedgerEntries, setRewardLedgerEntries,
    refetch: loadAllData,

    // Client actions
    addClient: (client: Omit<Client, 'id'>) => createItem(clientService.create(client), setClients),
    updateClient: (id: string, client: Partial<Client>) => updateItem(clientService.update(id, client), setClients),
    deleteClient: (id: string) => deleteItem(id, clientService.delete(id), setClients),

    // Project actions
    addProject: (project: Omit<Project, 'id'>) => createItem(projectService.create(project), setProjects),
    updateProject: (id: string, project: Partial<Project>) => updateItem(projectService.update(id, project), setProjects),
    deleteProject: (id: string) => deleteItem(id, projectService.delete(id), setProjects),

    // Transaction actions
    addTransaction: (transaction: Omit<Transaction, 'id'>) => createItem(transactionService.create(transaction), setTransactions),
    updateTransaction: (id: string, transaction: Partial<Transaction>) => updateItem(transactionService.update(id, transaction), setTransactions),
    deleteTransaction: (id: string) => deleteItem(id, transactionService.delete(id), setTransactions),

    // PromoCode actions
    updatePromoCode: (id: string, promoCode: Partial<PromoCode>) => updateItem(promoCodeService.update(id, promoCode), setPromoCodes),

    // Card actions
    updateCard: (id: string, card: Partial<Card>) => updateItem(cardService.update(id, card), setCards),

    // Pocket actions
    updatePocket: (id: string, pocket: Partial<FinancialPocket>) => updateItem(financialPocketService.update(id, pocket), setPockets)

  }
}