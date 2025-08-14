import { supabase } from '../lib/supabase'
import type { 
  User, Client, Project, Transaction, TeamMember, Package, AddOn, Lead, 
  Card, FinancialPocket, Contract, Asset, ClientFeedback, Notification,
  SocialMediaPost, PromoCode, SOP, Profile, TeamProjectPayment, TeamPaymentRecord,
  RewardLedgerEntry
} from '../types'

// Users
export const userService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw error
    return data.map(user => ({
      id: user.id,
      email: user.email,
      password: user.password,
      fullName: user.full_name,
      role: user.role as 'Admin' | 'Member',
      permissions: user.permissions
    }))
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    const { data, error } = await supabase.from('users').insert({
      email: user.email,
      password: user.password,
      full_name: user.fullName,
      role: user.role,
      permissions: user.permissions || []
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      fullName: data.full_name,
      role: data.role,
      permissions: data.permissions
    }
  },

  async update(id: string, user: Partial<User>): Promise<User> {
    const { data, error } = await supabase.from('users').update({
      email: user.email,
      password: user.password,
      full_name: user.fullName,
      role: user.role,
      permissions: user.permissions
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      fullName: data.full_name,
      role: data.role,
      permissions: data.permissions
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) throw error
  }
}

// Clients
export const clientService = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase.from('clients').select('*')
    if (error) throw error
    return data.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      since: client.since,
      instagram: client.instagram,
      status: client.status as any,
      clientType: client.client_type as any,
      lastContact: client.last_contact,
      portalAccessId: client.portal_access_id
    }))
  },

  async getByPortalId(portalId: string): Promise<Client | null> {
    const { data, error } = await supabase.from('clients').select('*').eq('portal_access_id', portalId).single()
    if (error) return null
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      since: data.since,
      instagram: data.instagram,
      status: data.status as any,
      clientType: data.client_type as any,
      lastContact: data.last_contact,
      portalAccessId: data.portal_access_id
    }
  },

  async create(client: Omit<Client, 'id'>): Promise<Client> {
    const { data, error } = await supabase.from('clients').insert({
      name: client.name,
      email: client.email,
      phone: client.phone,
      since: client.since,
      instagram: client.instagram,
      status: client.status,
      client_type: client.clientType,
      last_contact: client.lastContact,
      portal_access_id: client.portalAccessId
    }).select().single()
    if (error) {
      console.error('Error creating client:', error)
      throw error
    }
    console.log('Successfully created client:', data)
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      since: data.since,
      instagram: data.instagram,
      status: data.status,
      clientType: data.client_type,
      lastContact: data.last_contact,
      portalAccessId: data.portal_access_id
    }
  },

  async update(id: string, client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase.from('clients').update({
      name: client.name,
      email: client.email,
      phone: client.phone,
      since: client.since,
      instagram: client.instagram,
      status: client.status,
      client_type: client.clientType,
      last_contact: client.lastContact,
      portal_access_id: client.portalAccessId
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      since: data.since,
      instagram: data.instagram,
      status: data.status,
      clientType: data.client_type,
      lastContact: data.last_contact,
      portalAccessId: data.portal_access_id
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) throw error
  }
}

// Projects
export const projectService = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*')
    if (error) throw error
    return data.map(project => ({
      id: project.id,
      projectName: project.project_name,
      clientName: project.client_name,
      clientId: project.client_id,
      projectType: project.project_type,
      packageName: project.package_name,
      packageId: project.package_id,
      addOns: project.add_ons || [],
      date: project.date,
      deadlineDate: project.deadline_date,
      location: project.location,
      progress: project.progress,
      status: project.status,
      activeSubStatuses: project.active_sub_statuses,
      totalCost: project.total_cost,
      amountPaid: project.amount_paid,
      paymentStatus: project.payment_status as any,
      team: project.team || [],
      notes: project.notes,
      accommodation: project.accommodation,
      driveLink: project.drive_link,
      clientDriveLink: project.client_drive_link,
      finalDriveLink: project.final_drive_link,
      startTime: project.start_time,
      endTime: project.end_time,
      image: project.image,
      revisions: project.revisions,
      promoCodeId: project.promo_code_id,
      discountAmount: project.discount_amount,
      shippingDetails: project.shipping_details,
      dpProofUrl: project.dp_proof_url,
      printingDetails: project.printing_details,
      printingCost: project.printing_cost,
      transportCost: project.transport_cost,
      isEditingConfirmedByClient: project.is_editing_confirmed_by_client,
      isPrintingConfirmedByClient: project.is_printing_confirmed_by_client,
      isDeliveryConfirmedByClient: project.is_delivery_confirmed_by_client,
      confirmedSubStatuses: project.confirmed_sub_statuses,
      clientSubStatusNotes: project.client_sub_status_notes,
      subStatusConfirmationSentAt: project.sub_status_confirmation_sent_at,
      completedDigitalItems: project.completed_digital_items,
      invoiceSignature: project.invoice_signature
    }))
  },

  async getByClientId(clientId: string): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*').eq('client_id', clientId)
    if (error) throw error
    return data.map(project => ({
      id: project.id,
      projectName: project.project_name,
      clientName: project.client_name,
      clientId: project.client_id,
      projectType: project.project_type,
      packageName: project.package_name,
      packageId: project.package_id,
      addOns: project.add_ons || [],
      date: project.date,
      deadlineDate: project.deadline_date,
      location: project.location,
      progress: project.progress,
      status: project.status,
      activeSubStatuses: project.active_sub_statuses,
      totalCost: project.total_cost,
      amountPaid: project.amount_paid,
      paymentStatus: project.payment_status as any,
      team: project.team || [],
      notes: project.notes,
      accommodation: project.accommodation,
      driveLink: project.drive_link,
      clientDriveLink: project.client_drive_link,
      finalDriveLink: project.final_drive_link,
      startTime: project.start_time,
      endTime: project.end_time,
      image: project.image,
      revisions: project.revisions,
      promoCodeId: project.promo_code_id,
      discountAmount: project.discount_amount,
      shippingDetails: project.shipping_details,
      dpProofUrl: project.dp_proof_url,
      printingDetails: project.printing_details,
      printingCost: project.printing_cost,
      transportCost: project.transport_cost,
      isEditingConfirmedByClient: project.is_editing_confirmed_by_client,
      isPrintingConfirmedByClient: project.is_printing_confirmed_by_client,
      isDeliveryConfirmedByClient: project.is_delivery_confirmed_by_client,
      confirmedSubStatuses: project.confirmed_sub_statuses,
      clientSubStatusNotes: project.client_sub_status_notes,
      subStatusConfirmationSentAt: project.sub_status_confirmation_sent_at,
      completedDigitalItems: project.completed_digital_items,
      invoiceSignature: project.invoice_signature
    }))
  },

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    const { data, error } = await supabase.from('projects').insert({
      project_name: project.projectName,
      client_name: project.clientName,
      client_id: project.clientId,
      project_type: project.projectType,
      package_name: project.packageName,
      package_id: project.packageId,
      add_ons: project.addOns,
      date: project.date,
      deadline_date: project.deadlineDate,
      location: project.location,
      progress: project.progress,
      status: project.status,
      active_sub_statuses: project.activeSubStatuses,
      total_cost: project.totalCost,
      amount_paid: project.amountPaid,
      payment_status: project.paymentStatus,
      team: project.team,
      notes: project.notes,
      accommodation: project.accommodation,
      drive_link: project.driveLink,
      client_drive_link: project.clientDriveLink,
      final_drive_link: project.finalDriveLink,
      start_time: project.startTime,
      end_time: project.endTime,
      image: project.image,
      revisions: project.revisions,
      promo_code_id: project.promoCodeId,
      discount_amount: project.discountAmount,
      shipping_details: project.shippingDetails,
      dp_proof_url: project.dpProofUrl,
      printing_details: project.printingDetails,
      printing_cost: project.printingCost,
      transport_cost: project.transportCost,
      is_editing_confirmed_by_client: project.isEditingConfirmedByClient,
      is_printing_confirmed_by_client: project.isPrintingConfirmedByClient,
      is_delivery_confirmed_by_client: project.isDeliveryConfirmedByClient,
      confirmed_sub_statuses: project.confirmedSubStatuses,
      client_sub_status_notes: project.clientSubStatusNotes,
      sub_status_confirmation_sent_at: project.subStatusConfirmationSentAt,
      completed_digital_items: project.completedDigitalItems,
      invoice_signature: project.invoiceSignature
    }).select().single()
    if (error) throw error

    return {
      id: data.id,
      projectName: data.project_name,
      clientName: data.client_name,
      clientId: data.client_id,
      projectType: data.project_type,
      packageName: data.package_name,
      packageId: data.package_id,
      addOns: data.add_ons || [],
      date: data.date,
      deadlineDate: data.deadline_date,
      location: data.location,
      progress: data.progress,
      status: data.status,
      activeSubStatuses: data.active_sub_statuses,
      totalCost: data.total_cost,
      amountPaid: data.amount_paid,
      paymentStatus: data.payment_status as any,
      team: data.team || [],
      notes: data.notes,
      accommodation: data.accommodation,
      driveLink: data.drive_link,
      clientDriveLink: data.client_drive_link,
      finalDriveLink: data.final_drive_link,
      startTime: data.start_time,
      endTime: data.end_time,
      image: data.image,
      revisions: data.revisions,
      promoCodeId: data.promo_code_id,
      discountAmount: data.discount_amount,
      shippingDetails: data.shipping_details,
      dpProofUrl: data.dp_proof_url,
      printingDetails: data.printing_details,
      printingCost: data.printing_cost,
      transportCost: data.transport_cost,
      isEditingConfirmedByClient: data.is_editing_confirmed_by_client,
      isPrintingConfirmedByClient: data.is_printing_confirmed_by_client,
      isDeliveryConfirmedByClient: data.is_delivery_confirmed_by_client,
      confirmedSubStatuses: data.confirmed_sub_statuses,
      clientSubStatusNotes: data.client_sub_status_notes,
      subStatusConfirmationSentAt: data.sub_status_confirmation_sent_at,
      completedDigitalItems: data.completed_digital_items,
      invoiceSignature: data.invoice_signature
    }
  },

  async update(id: string, project: Partial<Project>): Promise<Project> {
    const updateData: any = {}
    if (project.projectName) updateData.project_name = project.projectName
    if (project.clientName) updateData.client_name = project.clientName
    if (project.clientId) updateData.client_id = project.clientId
    if (project.projectType) updateData.project_type = project.projectType
    if (project.packageName) updateData.package_name = project.packageName
    if (project.packageId) updateData.package_id = project.packageId
    if (project.addOns !== undefined) updateData.add_ons = project.addOns
    if (project.date) updateData.date = project.date
    if (project.deadlineDate !== undefined) updateData.deadline_date = project.deadlineDate
    if (project.location) updateData.location = project.location
    if (project.progress !== undefined) updateData.progress = project.progress
    if (project.status) updateData.status = project.status
    if (project.activeSubStatuses !== undefined) updateData.active_sub_statuses = project.activeSubStatuses
    if (project.totalCost !== undefined) updateData.total_cost = project.totalCost
    if (project.amountPaid !== undefined) updateData.amount_paid = project.amountPaid
    if (project.paymentStatus) updateData.payment_status = project.paymentStatus
    if (project.team !== undefined) updateData.team = project.team
    if (project.notes !== undefined) updateData.notes = project.notes
    if (project.accommodation !== undefined) updateData.accommodation = project.accommodation
    if (project.driveLink !== undefined) updateData.drive_link = project.driveLink
    if (project.clientDriveLink !== undefined) updateData.client_drive_link = project.clientDriveLink
    if (project.finalDriveLink !== undefined) updateData.final_drive_link = project.finalDriveLink
    if (project.startTime !== undefined) updateData.start_time = project.startTime
    if (project.endTime !== undefined) updateData.end_time = project.endTime
    if (project.image !== undefined) updateData.image = project.image
    if (project.revisions !== undefined) updateData.revisions = project.revisions
    if (project.promoCodeId !== undefined) updateData.promo_code_id = project.promoCodeId
    if (project.discountAmount !== undefined) updateData.discount_amount = project.discountAmount
    if (project.shippingDetails !== undefined) updateData.shipping_details = project.shippingDetails
    if (project.dpProofUrl !== undefined) updateData.dp_proof_url = project.dpProofUrl
    if (project.printingDetails !== undefined) updateData.printing_details = project.printingDetails
    if (project.printingCost !== undefined) updateData.printing_cost = project.printingCost
    if (project.transportCost !== undefined) updateData.transport_cost = project.transportCost
    if (project.isEditingConfirmedByClient !== undefined) updateData.is_editing_confirmed_by_client = project.isEditingConfirmedByClient
    if (project.isPrintingConfirmedByClient !== undefined) updateData.is_printing_confirmed_by_client = project.isPrintingConfirmedByClient
    if (project.isDeliveryConfirmedByClient !== undefined) updateData.is_delivery_confirmed_by_client = project.isDeliveryConfirmedByClient
    if (project.confirmedSubStatuses !== undefined) updateData.confirmed_sub_statuses = project.confirmedSubStatuses
    if (project.clientSubStatusNotes !== undefined) updateData.client_sub_status_notes = project.clientSubStatusNotes
    if (project.subStatusConfirmationSentAt !== undefined) updateData.sub_status_confirmation_sent_at = project.subStatusConfirmationSentAt
    if (project.completedDigitalItems !== undefined) updateData.completed_digital_items = project.completedDigitalItems
    if (project.invoiceSignature !== undefined) updateData.invoice_signature = project.invoiceSignature

    const { data, error } = await supabase.from('projects').update(updateData).eq('id', id).select().single()
    if (error) throw error

    return {
      id: data.id,
      projectName: data.project_name,
      clientName: data.client_name,
      clientId: data.client_id,
      projectType: data.project_type,
      packageName: data.package_name,
      packageId: data.package_id,
      addOns: data.add_ons || [],
      date: data.date,
      deadlineDate: data.deadline_date,
      location: data.location,
      progress: data.progress,
      status: data.status,
      activeSubStatuses: data.active_sub_statuses,
      totalCost: data.total_cost,
      amountPaid: data.amount_paid,
      paymentStatus: data.payment_status as any,
      team: data.team || [],
      notes: data.notes,
      accommodation: data.accommodation,
      driveLink: data.drive_link,
      clientDriveLink: data.client_drive_link,
      finalDriveLink: data.final_drive_link,
      startTime: data.start_time,
      endTime: data.end_time,
      image: data.image,
      revisions: data.revisions,
      promoCodeId: data.promo_code_id,
      discountAmount: data.discount_amount,
      shippingDetails: data.shipping_details,
      dpProofUrl: data.dp_proof_url,
      printingDetails: data.printing_details,
      printingCost: data.printing_cost,
      transportCost: data.transport_cost,
      isEditingConfirmedByClient: data.is_editing_confirmed_by_client,
      isPrintingConfirmedByClient: data.is_printing_confirmed_by_client,
      isDeliveryConfirmedByClient: data.is_delivery_confirmed_by_client,
      confirmedSubStatuses: data.confirmed_sub_statuses,
      clientSubStatusNotes: data.client_sub_status_notes,
      subStatusConfirmationSentAt: data.sub_status_confirmation_sent_at,
      completedDigitalItems: data.completed_digital_items,
      invoiceSignature: data.invoice_signature
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
  }
}

// Transactions
export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase.from('transactions').select('*')
    if (error) throw error
    return data.map(transaction => ({
      id: transaction.id,
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type as any,
      projectId: transaction.project_id,
      category: transaction.category,
      method: transaction.method as any,
      pocketId: transaction.pocket_id,
      cardId: transaction.card_id,
      printingItemId: transaction.printing_item_id,
      vendorSignature: transaction.vendor_signature
    }))
  },

  async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const { data, error } = await supabase.from('transactions').insert({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      project_id: transaction.projectId,
      category: transaction.category,
      method: transaction.method,
      pocket_id: transaction.pocketId,
      card_id: transaction.cardId,
      printing_item_id: transaction.printingItemId,
      vendor_signature: transaction.vendorSignature,
      team_member_id: (transaction as any).teamMemberId
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      date: data.date,
      description: data.description,
      amount: data.amount,
      type: data.type,
      projectId: data.project_id,
      category: data.category,
      method: data.method,
      pocketId: data.pocket_id,
      cardId: data.card_id,
      printingItemId: data.printing_item_id,
      vendorSignature: data.vendor_signature
    }
  },

  async update(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase.from('transactions').update({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      project_id: transaction.projectId,
      category: transaction.category,
      method: transaction.method,
      pocket_id: transaction.pocketId,
      card_id: transaction.cardId,
      printing_item_id: transaction.printingItemId,
      vendor_signature: transaction.vendorSignature
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      date: data.date,
      description: data.description,
      amount: data.amount,
      type: data.type,
      projectId: data.project_id,
      category: data.category,
      method: data.method,
      pocketId: data.pocket_id,
      cardId: data.card_id,
      printingItemId: data.printing_item_id,
      vendorSignature: data.vendor_signature
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
  }
}

// Team Members
export const teamMemberService = {
  async getAll(): Promise<TeamMember[]> {
    const { data, error } = await supabase.from('team_members').select('*')
    if (error) throw error
    return data.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      standardFee: member.standard_fee,
      noRek: member.no_rek,
      rewardBalance: member.reward_balance,
      rating: member.rating,
      performanceNotes: member.performance_notes || [],
      portalAccessId: member.portal_access_id
    }))
  },

  async getByPortalId(portalId: string): Promise<TeamMember | null> {
    const { data, error } = await supabase.from('team_members').select('*').eq('portal_access_id', portalId).single()
    if (error) return null
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      standardFee: data.standard_fee,
      noRek: data.no_rek,
      rewardBalance: data.reward_balance,
      rating: data.rating,
      performanceNotes: data.performance_notes || [],
      portalAccessId: data.portal_access_id
    }
  },

  async create(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    const { data, error } = await supabase.from('team_members').insert({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      standard_fee: member.standardFee,
      no_rek: member.noRek,
      reward_balance: member.rewardBalance,
      rating: member.rating,
      performance_notes: member.performanceNotes,
      portal_access_id: member.portalAccessId
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      standardFee: data.standard_fee,
      noRek: data.no_rek,
      rewardBalance: data.reward_balance,
      rating: data.rating,
      performanceNotes: data.performance_notes || [],
      portalAccessId: data.portal_access_id
    }
  },

  async update(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    const { data, error } = await supabase.from('team_members').update({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      standard_fee: member.standardFee,
      no_rek: member.noRek,
      reward_balance: member.rewardBalance,
      rating: member.rating,
      performance_notes: member.performanceNotes,
      portal_access_id: member.portalAccessId
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      standardFee: data.standard_fee,
      noRek: data.no_rek,
      rewardBalance: data.reward_balance,
      rating: data.rating,
      performanceNotes: data.performance_notes || [],
      portalAccessId: data.portal_access_id
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) throw error
  }
}

// Packages
export const packageService = {
  async getAll(): Promise<Package[]> {
    const { data, error } = await supabase.from('packages').select('*')
    if (error) throw error
    return data.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      physicalItems: pkg.physical_items || [],
      digitalItems: pkg.digital_items || [],
      processingTime: pkg.processing_time,
      defaultPrintingCost: pkg.default_printing_cost,
      defaultTransportCost: pkg.default_transport_cost,
      photographers: pkg.photographers,
      videographers: pkg.videographers
    }))
  },

  async create(pkg: Omit<Package, 'id'>): Promise<Package> {
    const { data, error } = await supabase.from('packages').insert({
      name: pkg.name,
      price: pkg.price,
      physical_items: pkg.physicalItems,
      digital_items: pkg.digitalItems,
      processing_time: pkg.processingTime,
      default_printing_cost: pkg.defaultPrintingCost,
      default_transport_cost: pkg.defaultTransportCost,
      photographers: pkg.photographers,
      videographers: pkg.videographers
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      physicalItems: data.physical_items || [],
      digitalItems: data.digital_items || [],
      processingTime: data.processing_time,
      defaultPrintingCost: data.default_printing_cost,
      defaultTransportCost: data.default_transport_cost,
      photographers: data.photographers,
      videographers: data.videographers
    }
  },

  async update(id: string, pkg: Partial<Package>): Promise<Package> {
    const { data, error } = await supabase.from('packages').update({
      name: pkg.name,
      price: pkg.price,
      physical_items: pkg.physicalItems,
      digital_items: pkg.digitalItems,
      processing_time: pkg.processingTime,
      default_printing_cost: pkg.defaultPrintingCost,
      default_transport_cost: pkg.defaultTransportCost,
      photographers: pkg.photographers,
      videographers: pkg.videographers
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      physicalItems: data.physical_items || [],
      digitalItems: data.digital_items || [],
      processingTime: data.processing_time,
      defaultPrintingCost: data.default_printing_cost,
      defaultTransportCost: data.default_transport_cost,
      photographers: data.photographers,
      videographers: data.videographers
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('packages').delete().eq('id', id)
    if (error) throw error
  }
}

// Add-ons
export const addOnService = {
  async getAll(): Promise<AddOn[]> {
    const { data, error } = await supabase.from('add_ons').select('*')
    if (error) throw error
    return data.map(addon => ({
      id: addon.id,
      name: addon.name,
      price: addon.price
    }))
  },

  async create(addon: Omit<AddOn, 'id'>): Promise<AddOn> {
    const { data, error } = await supabase.from('add_ons').insert({
      name: addon.name,
      price: addon.price
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      price: data.price
    }
  },

  async update(id: string, addon: Partial<AddOn>): Promise<AddOn> {
    const { data, error } = await supabase.from('add_ons').update({
      name: addon.name,
      price: addon.price
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      price: data.price
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('add_ons').delete().eq('id', id)
    if (error) throw error
  }
}

// Leads
export const leadService = {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase.from('leads').select('*')
    if (error) throw error
    return data.map(lead => ({
      id: lead.id,
      name: lead.name,
      contactChannel: lead.contact_channel as any,
      location: lead.location,
      status: lead.status as any,
      date: lead.date,
      notes: lead.notes
    }))
  },

  async create(lead: Omit<Lead, 'id'>): Promise<Lead> {
    const { data, error } = await supabase.from('leads').insert({
      name: lead.name,
      contact_channel: lead.contactChannel,
      location: lead.location,
      status: lead.status,
      date: lead.date,
      notes: lead.notes
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      contactChannel: data.contact_channel,
      location: data.location,
      status: data.status,
      date: data.date,
      notes: data.notes
    }
  },

  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase.from('leads').update({
      name: lead.name,
      contact_channel: lead.contactChannel,
      location: lead.location,
      status: lead.status,
      date: lead.date,
      notes: lead.notes
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      contactChannel: data.contact_channel,
      location: data.location,
      status: data.status,
      date: data.date,
      notes: data.notes
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (error) throw error
  }
}

// Cards
export const cardService = {
  async getAll(): Promise<Card[]> {
    const { data, error } = await supabase.from('cards').select('*')
    if (error) throw error
    return data.map(card => ({
      id: card.id,
      cardHolderName: card.card_holder_name,
      bankName: card.bank_name,
      cardType: card.card_type as any,
      lastFourDigits: card.last_four_digits,
      expiryDate: card.expiry_date,
      balance: card.balance,
      colorGradient: card.color_gradient
    }))
  },

  async create(card: Omit<Card, 'id'>): Promise<Card> {
    const { data, error } = await supabase.from('cards').insert({
      card_holder_name: card.cardHolderName,
      bank_name: card.bankName,
      card_type: card.cardType,
      last_four_digits: card.lastFourDigits,
      expiry_date: card.expiryDate,
      balance: card.balance,
      color_gradient: card.colorGradient
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      cardHolderName: data.card_holder_name,
      bankName: data.bank_name,
      cardType: data.card_type,
      lastFourDigits: data.last_four_digits,
      expiryDate: data.expiry_date,
      balance: data.balance,
      colorGradient: data.color_gradient
    }
  },

  async update(id: string, card: Partial<Card>): Promise<Card> {
    const { data, error } = await supabase.from('cards').update({
      card_holder_name: card.cardHolderName,
      bank_name: card.bankName,
      card_type: card.cardType,
      last_four_digits: card.lastFourDigits,
      expiry_date: card.expiryDate,
      balance: card.balance,
      color_gradient: card.colorGradient
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      cardHolderName: data.card_holder_name,
      bankName: data.bank_name,
      cardType: data.card_type,
      lastFourDigits: data.last_four_digits,
      expiryDate: data.expiry_date,
      balance: data.balance,
      colorGradient: data.color_gradient
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('cards').delete().eq('id', id)
    if (error) throw error
  }
}

// Financial Pockets
export const financialPocketService = {
  async getAll(): Promise<FinancialPocket[]> {
    const { data, error } = await supabase.from('financial_pockets').select('*')
    if (error) throw error
    return data.map(pocket => ({
      id: pocket.id,
      name: pocket.name,
      description: pocket.description,
      icon: pocket.icon as any,
      type: pocket.type as any,
      amount: pocket.amount,
      goalAmount: pocket.goal_amount,
      lockEndDate: pocket.lock_end_date,
      sourceCardId: pocket.source_card_id
    }))
  },

  async create(pocket: Omit<FinancialPocket, 'id'>): Promise<FinancialPocket> {
    const { data, error } = await supabase.from('financial_pockets').insert({
      name: pocket.name,
      description: pocket.description,
      icon: pocket.icon,
      type: pocket.type,
      amount: pocket.amount,
      goal_amount: pocket.goalAmount,
      lock_end_date: pocket.lockEndDate,
      source_card_id: pocket.sourceCardId
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      icon: data.icon,
      type: data.type,
      amount: data.amount,
      goalAmount: data.goal_amount,
      lockEndDate: data.lock_end_date,
      sourceCardId: data.source_card_id
    }
  },

  async update(id: string, pocket: Partial<FinancialPocket>): Promise<FinancialPocket> {
    const { data, error } = await supabase.from('financial_pockets').update({
      name: pocket.name,
      description: pocket.description,
      icon: pocket.icon,
      type: pocket.type,
      amount: pocket.amount,
      goal_amount: pocket.goalAmount,
      lock_end_date: pocket.lockEndDate,
      source_card_id: pocket.sourceCardId
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      icon: data.icon,
      type: data.type,
      amount: data.amount,
      goalAmount: data.goal_amount,
      lockEndDate: data.lock_end_date,
      sourceCardId: data.source_card_id
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('financial_pockets').delete().eq('id', id)
    if (error) throw error
  }
}

// Contracts
export const contractService = {
  async getAll(): Promise<Contract[]> {
    const { data, error } = await supabase.from('contracts').select('*')
    if (error) throw error
    return data.map(contract => ({
      id: contract.id,
      contractNumber: contract.contract_number,
      clientId: contract.client_id,
      projectId: contract.project_id,
      signingDate: contract.signing_date,
      signingLocation: contract.signing_location,
      createdAt: contract.created_at,
      clientName1: contract.client_name1,
      clientAddress1: contract.client_address1,
      clientPhone1: contract.client_phone1,
      clientName2: contract.client_name2,
      clientAddress2: contract.client_address2,
      clientPhone2: contract.client_phone2,
      shootingDuration: contract.shooting_duration,
      guaranteedPhotos: contract.guaranteed_photos,
      albumDetails: contract.album_details,
      digitalFilesFormat: contract.digital_files_format,
      otherItems: contract.other_items,
      personnelCount: contract.personnel_count,
      deliveryTimeframe: contract.delivery_timeframe,
      dpDate: contract.dp_date,
      finalPaymentDate: contract.final_payment_date,
      cancellationPolicy: contract.cancellation_policy,
      jurisdiction: contract.jurisdiction,
      vendorSignature: contract.vendor_signature,
      clientSignature: contract.client_signature
    }))
  },

  async create(contract: Omit<Contract, 'id'>): Promise<Contract> {
    const { data, error } = await supabase.from('contracts').insert({
      contract_number: contract.contractNumber,
      client_id: contract.clientId,
      project_id: contract.projectId,
      signing_date: contract.signingDate,
      signing_location: contract.signingLocation,
      client_name1: contract.clientName1,
      client_address1: contract.clientAddress1,
      client_phone1: contract.clientPhone1,
      client_name2: contract.clientName2,
      client_address2: contract.clientAddress2,
      client_phone2: contract.clientPhone2,
      shooting_duration: contract.shootingDuration,
      guaranteed_photos: contract.guaranteedPhotos,
      album_details: contract.albumDetails,
      digital_files_format: contract.digitalFilesFormat,
      other_items: contract.otherItems,
      personnel_count: contract.personnelCount,
      delivery_timeframe: contract.deliveryTimeframe,
      dp_date: contract.dpDate,
      final_payment_date: contract.finalPaymentDate,
      cancellation_policy: contract.cancellationPolicy,
      jurisdiction: contract.jurisdiction,
      vendor_signature: contract.vendorSignature,
      client_signature: contract.clientSignature
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      contractNumber: data.contract_number,
      clientId: data.client_id,
      projectId: data.project_id,
      signingDate: data.signing_date,
      signingLocation: data.signing_location,
      createdAt: data.created_at,
      clientName1: data.client_name1,
      clientAddress1: data.client_address1,
      clientPhone1: data.client_phone1,
      clientName2: data.client_name2,
      clientAddress2: data.client_address2,
      clientPhone2: data.client_phone2,
      shootingDuration: data.shooting_duration,
      guaranteedPhotos: data.guaranteed_photos,
      albumDetails: data.album_details,
      digitalFilesFormat: data.digital_files_format,
      otherItems: data.other_items,
      personnelCount: data.personnel_count,
      deliveryTimeframe: data.delivery_timeframe,
      dpDate: data.dp_date,
      finalPaymentDate: data.final_payment_date,
      cancellationPolicy: data.cancellation_policy,
      jurisdiction: data.jurisdiction,
      vendorSignature: data.vendor_signature,
      clientSignature: data.client_signature
    }
  },

  async update(id: string, contract: Partial<Contract>): Promise<Contract> {
    const updateData: any = {}
    if (contract.contractNumber) updateData.contract_number = contract.contractNumber
    if (contract.clientId) updateData.client_id = contract.clientId
    if (contract.projectId) updateData.project_id = contract.projectId
    if (contract.signingDate) updateData.signing_date = contract.signingDate
    if (contract.signingLocation) updateData.signing_location = contract.signingLocation
    if (contract.clientName1) updateData.client_name1 = contract.clientName1
    if (contract.clientAddress1) updateData.client_address1 = contract.clientAddress1
    if (contract.clientPhone1) updateData.client_phone1 = contract.clientPhone1
    if (contract.clientName2 !== undefined) updateData.client_name2 = contract.clientName2
    if (contract.clientAddress2 !== undefined) updateData.client_address2 = contract.clientAddress2
    if (contract.clientPhone2 !== undefined) updateData.client_phone2 = contract.clientPhone2
    if (contract.shootingDuration) updateData.shooting_duration = contract.shootingDuration
    if (contract.guaranteedPhotos) updateData.guaranteed_photos = contract.guaranteedPhotos
    if (contract.albumDetails) updateData.album_details = contract.albumDetails
    if (contract.digitalFilesFormat) updateData.digital_files_format = contract.digitalFilesFormat
    if (contract.otherItems) updateData.other_items = contract.otherItems
    if (contract.personnelCount) updateData.personnel_count = contract.personnelCount
    if (contract.deliveryTimeframe) updateData.delivery_timeframe = contract.deliveryTimeframe
    if (contract.dpDate) updateData.dp_date = contract.dpDate
    if (contract.finalPaymentDate) updateData.final_payment_date = contract.finalPaymentDate
    if (contract.cancellationPolicy) updateData.cancellation_policy = contract.cancellationPolicy
    if (contract.jurisdiction) updateData.jurisdiction = contract.jurisdiction
    if (contract.vendorSignature !== undefined) updateData.vendor_signature = contract.vendorSignature
    if (contract.clientSignature !== undefined) updateData.client_signature = contract.clientSignature

    const { data, error } = await supabase.from('contracts').update(updateData).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      contractNumber: data.contract_number,
      clientId: data.client_id,
      projectId: data.project_id,
      signingDate: data.signing_date,
      signingLocation: data.signing_location,
      createdAt: data.created_at,
      clientName1: data.client_name1,
      clientAddress1: data.client_address1,
      clientPhone1: data.client_phone1,
      clientName2: data.client_name2,
      clientAddress2: data.client_address2,
      clientPhone2: data.client_phone2,
      shootingDuration: data.shooting_duration,
      guaranteedPhotos: data.guaranteed_photos,
      albumDetails: data.album_details,
      digitalFilesFormat: data.digital_files_format,
      otherItems: data.other_items,
      personnelCount: data.personnel_count,
      deliveryTimeframe: data.delivery_timeframe,
      dpDate: data.dp_date,
      finalPaymentDate: data.final_payment_date,
      cancellationPolicy: data.cancellation_policy,
      jurisdiction: data.jurisdiction,
      vendorSignature: data.vendor_signature,
      clientSignature: data.client_signature
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('contracts').delete().eq('id', id)
    if (error) throw error
  }
}

// Assets
export const assetService = {
  async getAll(): Promise<Asset[]> {
    const { data, error } = await supabase.from('assets').select('*')
    if (error) throw error
    return data.map(asset => ({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      purchaseDate: asset.purchase_date,
      purchasePrice: asset.purchase_price,
      serialNumber: asset.serial_number,
      status: asset.status as any,
      notes: asset.notes
    }))
  },

  async create(asset: Omit<Asset, 'id'>): Promise<Asset> {
    const { data, error } = await supabase.from('assets').insert({
      name: asset.name,
      category: asset.category,
      purchase_date: asset.purchaseDate,
      purchase_price: asset.purchasePrice,
      serial_number: asset.serialNumber,
      status: asset.status,
      notes: asset.notes
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      purchaseDate: data.purchase_date,
      purchasePrice: data.purchase_price,
      serialNumber: data.serial_number,
      status: data.status,
      notes: data.notes
    }
  },

  async update(id: string, asset: Partial<Asset>): Promise<Asset> {
    const { data, error } = await supabase.from('assets').update({
      name: asset.name,
      category: asset.category,
      purchase_date: asset.purchaseDate,
      purchase_price: asset.purchasePrice,
      serial_number: asset.serialNumber,
      status: asset.status,
      notes: asset.notes
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      purchaseDate: data.purchase_date,
      purchasePrice: data.purchase_price,
      serialNumber: data.serial_number,
      status: data.status,
      notes: data.notes
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('assets').delete().eq('id', id)
    if (error) throw error
  }
}

// Client Feedback
export const clientFeedbackService = {
  async getAll(): Promise<ClientFeedback[]> {
    const { data, error } = await supabase.from('client_feedback').select('*')
    if (error) throw error
    return data.map(feedback => ({
      id: feedback.id,
      clientName: feedback.client_name,
      satisfaction: feedback.satisfaction as any,
      rating: feedback.rating,
      feedback: feedback.feedback,
      date: feedback.date
    }))
  },

  async create(feedback: Omit<ClientFeedback, 'id'>): Promise<ClientFeedback> {
    const { data, error } = await supabase.from('client_feedback').insert({
      client_name: feedback.clientName,
      satisfaction: feedback.satisfaction,
      rating: feedback.rating,
      feedback: feedback.feedback,
      date: feedback.date
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      clientName: data.client_name,
      satisfaction: data.satisfaction,
      rating: data.rating,
      feedback: data.feedback,
      date: data.date
    }
  },

  async update(id: string, feedback: Partial<ClientFeedback>): Promise<ClientFeedback> {
    const { data, error } = await supabase.from('client_feedback').update({
      client_name: feedback.clientName,
      satisfaction: feedback.satisfaction,
      rating: feedback.rating,
      feedback: feedback.feedback,
      date: feedback.date
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      clientName: data.client_name,
      satisfaction: data.satisfaction,
      rating: data.rating,
      feedback: data.feedback,
      date: data.date
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('client_feedback').delete().eq('id', id)
    if (error) throw error
  }
}

// Notifications
export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const { data, error } = await supabase.from('notifications').select('*')
    if (error) throw error
    return data.map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      timestamp: notification.timestamp,
      isRead: notification.is_read,
      icon: notification.icon as any,
      link: notification.link_view ? {
        view: notification.link_view as any,
        action: notification.link_action
      } : undefined
    }))
  },

  async create(notification: Omit<Notification, 'id'>): Promise<Notification> {
    const { data, error } = await supabase.from('notifications').insert({
      title: notification.title,
      message: notification.message,
      timestamp: notification.timestamp,
      is_read: notification.isRead,
      icon: notification.icon,
      link_view: notification.link?.view,
      link_action: notification.link?.action
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      title: data.title,
      message: data.message,
      timestamp: data.timestamp,
      isRead: data.is_read,
      icon: data.icon,
      link: data.link_view ? {
        view: data.link_view,
        action: data.link_action
      } : undefined
    }
  },

  async update(id: string, notification: Partial<Notification>): Promise<Notification> {
    const { data, error } = await supabase.from('notifications').update({
      title: notification.title,
      message: notification.message,
      timestamp: notification.timestamp,
      is_read: notification.isRead,
      icon: notification.icon,
      link_view: notification.link?.view,
      link_action: notification.link?.action
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      title: data.title,
      message: data.message,
      timestamp: data.timestamp,
      isRead: data.is_read,
      icon: data.icon,
      link: data.link_view ? {
        view: data.link_view,
        action: data.link_action
      } : undefined
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('notifications').delete().eq('id', id)
    if (error) throw error
  }
}

// Social Media Posts
export const socialMediaPostService = {
  async getAll(): Promise<SocialMediaPost[]> {
    const { data, error } = await supabase.from('social_media_posts').select('*')
    if (error) throw error
    return data.map(post => ({
      id: post.id,
      projectId: post.project_id,
      clientName: post.client_name,
      postType: post.post_type as any,
      platform: post.platform as any,
      scheduledDate: post.scheduled_date,
      caption: post.caption,
      mediaUrl: post.media_url,
      status: post.status as any,
      notes: post.notes
    }))
  },

  async create(post: Omit<SocialMediaPost, 'id'>): Promise<SocialMediaPost> {
    const { data, error } = await supabase.from('social_media_posts').insert({
      project_id: post.projectId,
      client_name: post.clientName,
      post_type: post.postType,
      platform: post.platform,
      scheduled_date: post.scheduledDate,
      caption: post.caption,
      media_url: post.mediaUrl,
      status: post.status,
      notes: post.notes
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      projectId: data.project_id,
      clientName: data.client_name,
      postType: data.post_type,
      platform: data.platform,
      scheduledDate: data.scheduled_date,
      caption: data.caption,
      mediaUrl: data.media_url,
      status: data.status,
      notes: data.notes
    }
  },

  async update(id: string, post: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    const { data, error } = await supabase.from('social_media_posts').update({
      project_id: post.projectId,
      client_name: post.clientName,
      post_type: post.postType,
      platform: post.platform,
      scheduled_date: post.scheduledDate,
      caption: post.caption,
      media_url: post.mediaUrl,
      status: post.status,
      notes: post.notes
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      projectId: data.project_id,
      clientName: data.client_name,
      postType: data.post_type,
      platform: data.platform,
      scheduledDate: data.scheduled_date,
      caption: data.caption,
      mediaUrl: data.media_url,
      status: data.status,
      notes: data.notes
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('social_media_posts').delete().eq('id', id)
    if (error) throw error
  }
}

// Promo Codes
export const promoCodeService = {
  async getAll(): Promise<PromoCode[]> {
    const { data, error } = await supabase.from('promo_codes').select('*')
    if (error) throw error
    return data.map(promo => ({
      id: promo.id,
      code: promo.code,
      discountType: promo.discount_type as any,
      discountValue: promo.discount_value,
      isActive: promo.is_active,
      usageCount: promo.usage_count,
      maxUsage: promo.max_usage,
      expiryDate: promo.expiry_date,
      createdAt: promo.created_at
    }))
  },

  async create(promo: Omit<PromoCode, 'id'>): Promise<PromoCode> {
    const { data, error } = await supabase.from('promo_codes').insert({
      code: promo.code,
      discount_type: promo.discountType,
      discount_value: promo.discountValue,
      is_active: promo.isActive,
      usage_count: promo.usageCount,
      max_usage: promo.maxUsage,
      expiry_date: promo.expiryDate
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      code: data.code,
      discountType: data.discount_type,
      discountValue: data.discount_value,
      isActive: data.is_active,
      usageCount: data.usage_count,
      maxUsage: data.max_usage,
      expiryDate: data.expiry_date,
      createdAt: data.created_at
    }
  },

  async update(id: string, promo: Partial<PromoCode>): Promise<PromoCode> {
    const { data, error } = await supabase.from('promo_codes').update({
      code: promo.code,
      discount_type: promo.discountType,
      discount_value: promo.discountValue,
      is_active: promo.isActive,
      usage_count: promo.usageCount,
      max_usage: promo.maxUsage,
      expiry_date: promo.expiryDate
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      code: data.code,
      discountType: data.discount_type,
      discountValue: data.discount_value,
      isActive: data.is_active,
      usageCount: data.usage_count,
      maxUsage: data.max_usage,
      expiryDate: data.expiry_date,
      createdAt: data.created_at
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('promo_codes').delete().eq('id', id)
    if (error) throw error
  }
}

// SOPs
export const sopService = {
  async getAll(): Promise<SOP[]> {
    const { data, error } = await supabase.from('sops').select('*')
    if (error) throw error
    return data.map(sop => ({
      id: sop.id,
      title: sop.title,
      category: sop.category,
      content: sop.content,
      lastUpdated: sop.last_updated
    }))
  },

  async create(sop: Omit<SOP, 'id'>): Promise<SOP> {
    const { data, error } = await supabase.from('sops').insert({
      title: sop.title,
      category: sop.category,
      content: sop.content,
      last_updated: sop.lastUpdated
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      title: data.title,
      category: data.category,
      content: data.content,
      lastUpdated: data.last_updated
    }
  },

  async update(id: string, sop: Partial<SOP>): Promise<SOP> {
    const { data, error } = await supabase.from('sops').update({
      title: sop.title,
      category: sop.category,
      content: sop.content,
      last_updated: sop.lastUpdated
    }).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      title: data.title,
      category: data.category,
      content: data.content,
      lastUpdated: data.last_updated
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('sops').delete().eq('id', id)
    if (error) throw error
  }
}

// Team Payment Records
export const teamPaymentRecordService = {
  async getAll(): Promise<TeamPaymentRecord[]> {
    const { data, error } = await supabase.from('team_payment_records').select('*')
    if (error) throw error
    return data.map(record => ({
      id: record.id,
      recordNumber: record.record_number,
      teamMemberId: record.team_member_id,
      date: record.date,
      projectPaymentIds: record.project_payment_ids || [],
      totalAmount: record.total_amount,
      vendorSignature: record.vendor_signature
    }))
  },

  async getByTeamMemberId(teamMemberId: string): Promise<TeamPaymentRecord[]> {
    const { data, error } = await supabase.from('team_payment_records').select('*').eq('team_member_id', teamMemberId)
    if (error) throw error
    return data.map(record => ({
      id: record.id,
      recordNumber: record.record_number,
      teamMemberId: record.team_member_id,
      date: record.date,
      projectPaymentIds: record.project_payment_ids || [],
      totalAmount: record.total_amount,
      vendorSignature: record.vendor_signature
    }))
  },

  async create(record: Omit<TeamPaymentRecord, 'id'>): Promise<TeamPaymentRecord> {
    const { data, error } = await supabase.from('team_payment_records').insert({
      record_number: record.recordNumber,
      team_member_id: record.teamMemberId,
      date: record.date,
      project_payment_ids: record.projectPaymentIds,
      total_amount: record.totalAmount,
      vendor_signature: record.vendorSignature
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      recordNumber: data.record_number,
      teamMemberId: data.team_member_id,
      date: data.date,
      projectPaymentIds: data.project_payment_ids || [],
      totalAmount: data.total_amount,
      vendorSignature: data.vendor_signature
    }
  },

  async update(id: string, record: Partial<TeamPaymentRecord>): Promise<TeamPaymentRecord> {
    const updateData: any = {}
    if (record.recordNumber) updateData.record_number = record.recordNumber
    if (record.teamMemberId) updateData.team_member_id = record.teamMemberId
    if (record.date) updateData.date = record.date
    if (record.projectPaymentIds !== undefined) updateData.project_payment_ids = record.projectPaymentIds
    if (record.totalAmount !== undefined) updateData.total_amount = record.totalAmount
    if (record.vendorSignature !== undefined) updateData.vendor_signature = record.vendorSignature

    const { data, error } = await supabase.from('team_payment_records').update(updateData).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      recordNumber: data.record_number,
      teamMemberId: data.team_member_id,
      date: data.date,
      projectPaymentIds: data.project_payment_ids || [],
      totalAmount: data.total_amount,
      vendorSignature: data.vendor_signature
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('team_payment_records').delete().eq('id', id)
    if (error) throw error
  }
}

// Team Project Payments
export const teamProjectPaymentService = {
  async getAll(): Promise<TeamProjectPayment[]> {
    const { data, error } = await supabase.from('team_project_payments').select('*')
    if (error) throw error
    return data.map(payment => ({
      id: payment.id,
      projectId: payment.project_id,
      teamMemberName: payment.team_member_name,
      teamMemberId: payment.team_member_id,
      date: payment.date,
      status: payment.status as 'Paid' | 'Unpaid',
      fee: payment.fee,
      reward: payment.reward
    }))
  },

  async getByTeamMemberId(teamMemberId: string): Promise<TeamProjectPayment[]> {
    const { data, error } = await supabase.from('team_project_payments').select('*').eq('team_member_id', teamMemberId)
    if (error) throw error
    return data.map(payment => ({
      id: payment.id,
      projectId: payment.project_id,
      teamMemberName: payment.team_member_name,
      teamMemberId: payment.team_member_id,
      date: payment.date,
      status: payment.status as 'Paid' | 'Unpaid',
      fee: payment.fee,
      reward: payment.reward
    }))
  },

  async getByProjectId(projectId: string): Promise<TeamProjectPayment[]> {
    const { data, error } = await supabase.from('team_project_payments').select('*').eq('project_id', projectId)
    if (error) throw error
    return data.map(payment => ({
      id: payment.id,
      projectId: payment.project_id,
      teamMemberName: payment.team_member_name,
      teamMemberId: payment.team_member_id,
      date: payment.date,
      status: payment.status as 'Paid' | 'Unpaid',
      fee: payment.fee,
      reward: payment.reward
    }))
  },

  async create(payment: Omit<TeamProjectPayment, 'id'>): Promise<TeamProjectPayment> {
    const { data, error } = await supabase.from('team_project_payments').insert({
      project_id: payment.projectId,
      team_member_name: payment.teamMemberName,
      team_member_id: payment.teamMemberId,
      date: payment.date,
      status: payment.status,
      fee: payment.fee,
      reward: payment.reward
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      projectId: data.project_id,
      teamMemberName: data.team_member_name,
      teamMemberId: data.team_member_id,
      date: data.date,
      status: data.status,
      fee: data.fee,
      reward: data.reward
    }
  },

  async update(id: string, payment: Partial<TeamProjectPayment>): Promise<TeamProjectPayment> {
    const updateData: any = {}
    if (payment.projectId) updateData.project_id = payment.projectId
    if (payment.teamMemberName) updateData.team_member_name = payment.teamMemberName
    if (payment.teamMemberId) updateData.team_member_id = payment.teamMemberId
    if (payment.date) updateData.date = payment.date
    if (payment.status) updateData.status = payment.status
    if (payment.fee !== undefined) updateData.fee = payment.fee
    if (payment.reward !== undefined) updateData.reward = payment.reward

    const { data, error } = await supabase.from('team_project_payments').update(updateData).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      projectId: data.project_id,
      teamMemberName: data.team_member_name,
      teamMemberId: data.team_member_id,
      date: data.date,
      status: data.status,
      fee: data.fee,
      reward: data.reward
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('team_project_payments').delete().eq('id', id)
    if (error) throw error
  }
}

// Reward Ledger Entries
export const rewardLedgerService = {
  async getAll(): Promise<RewardLedgerEntry[]> {
    const { data, error } = await supabase.from('reward_ledger_entries').select('*')
    if (error) throw error
    return data.map(entry => ({
      id: entry.id,
      teamMemberId: entry.team_member_id,
      date: entry.date,
      description: entry.description,
      amount: entry.amount,
      projectId: entry.project_id
    }))
  },

  async getByTeamMemberId(teamMemberId: string): Promise<RewardLedgerEntry[]> {
    const { data, error } = await supabase.from('reward_ledger_entries').select('*').eq('team_member_id', teamMemberId).order('date', { ascending: false })
    if (error) throw error
    return data.map(entry => ({
      id: entry.id,
      teamMemberId: entry.team_member_id,
      date: entry.date,
      description: entry.description,
      amount: entry.amount,
      projectId: entry.project_id
    }))
  },

  async create(entry: Omit<RewardLedgerEntry, 'id'>): Promise<RewardLedgerEntry> {
    const { data, error } = await supabase.from('reward_ledger_entries').insert({
      team_member_id: entry.teamMemberId,
      date: entry.date,
      description: entry.description,
      amount: entry.amount,
      project_id: entry.projectId
    }).select().single()
    if (error) throw error
    return {
      id: data.id,
      teamMemberId: data.team_member_id,
      date: data.date,
      description: data.description,
      amount: data.amount,
      projectId: data.project_id
    }
  },

  async update(id: string, entry: Partial<RewardLedgerEntry>): Promise<RewardLedgerEntry> {
    const updateData: any = {}
    if (entry.teamMemberId) updateData.team_member_id = entry.teamMemberId
    if (entry.date) updateData.date = entry.date
    if (entry.description) updateData.description = entry.description
    if (entry.amount !== undefined) updateData.amount = entry.amount
    if (entry.projectId !== undefined) updateData.project_id = entry.projectId

    const { data, error } = await supabase.from('reward_ledger_entries').update(updateData).eq('id', id).select().single()
    if (error) throw error
    return {
      id: data.id,
      teamMemberId: data.team_member_id,
      date: data.date,
      description: data.description,
      amount: data.amount,
      projectId: data.project_id
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('reward_ledger_entries').delete().eq('id', id)
    if (error) throw error
  }
}

// Profile
export const profileService = {
  async get(): Promise<Profile | null> {
    const { data, error } = await supabase.from('profiles').select('*').single()
    if (error) return null
    return {
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      companyName: data.company_name,
      website: data.website,
      address: data.address,
      bankAccount: data.bank_account,
      authorizedSigner: data.authorized_signer,
      idNumber: data.id_number,
      bio: data.bio,
      incomeCategories: data.income_categories || [],
      expenseCategories: data.expense_categories || [],
      projectTypes: data.project_types || [],
      eventTypes: data.event_types || [],
      assetCategories: data.asset_categories || [],
      sopCategories: data.sop_categories || [],
      projectStatusConfig: data.project_status_config || [],
      notificationSettings: data.notification_settings || { newProject: true, paymentConfirmation: true, deadlineReminder: true },
      securitySettings: data.security_settings || { twoFactorEnabled: false },
      briefingTemplate: data.briefing_template,
      termsAndConditions: data.terms_and_conditions,
      contractTemplate: data.contract_template
    }
  },

  async createOrUpdate(profile: Omit<Profile, 'id'>): Promise<Profile> {
    const { data, error } = await supabase.from('profiles').upsert({
      id: '1', // Single profile record
      full_name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      company_name: profile.companyName,
      website: profile.website,
      address: profile.address,
      bank_account: profile.bankAccount,
      authorized_signer: profile.authorizedSigner,
      id_number: profile.idNumber,
      bio: profile.bio,
      income_categories: profile.incomeCategories,
      expense_categories: profile.expenseCategories,
      project_types: profile.projectTypes,
      event_types: profile.eventTypes,
      asset_categories: profile.assetCategories,
      sop_categories: profile.sopCategories,
      project_status_config: profile.projectStatusConfig,
      notification_settings: profile.notificationSettings,
      security_settings: profile.securitySettings,
      briefing_template: profile.briefingTemplate,
      terms_and_conditions: profile.termsAndConditions,
      contract_template: profile.contractTemplate
    }).select().single()
    if (error) throw error
    return {
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      companyName: data.company_name,
      website: data.website,
      address: data.address,
      bankAccount: data.bank_account,
      authorizedSigner: data.authorized_signer,
      idNumber: data.id_number,
      bio: data.bio,
      incomeCategories: data.income_categories || [],
      expenseCategories: data.expense_categories || [],
      projectTypes: data.project_types || [],
      eventTypes: data.event_types || [],
      assetCategories: data.asset_categories || [],
      sopCategories: data.sop_categories || [],
      projectStatusConfig: data.project_status_config || [],
      notificationSettings: data.notification_settings || { newProject: true, paymentConfirmation: true, deadlineReminder: true },
      securitySettings: data.security_settings || { twoFactorEnabled: false },
      briefingTemplate: data.briefing_template,
      termsAndConditions: data.terms_and_conditions,
      contractTemplate: data.contract_template
    }
  }
}