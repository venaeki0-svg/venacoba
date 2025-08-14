
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Member')),
    permissions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    since DATE NOT NULL,
    instagram VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    client_type VARCHAR(50) NOT NULL,
    last_contact DATE NOT NULL,
    portal_access_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    standard_fee DECIMAL(15,2) NOT NULL DEFAULT 0,
    no_rek VARCHAR(100),
    reward_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    performance_notes JSONB DEFAULT '[]',
    portal_access_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Packages table
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    physical_items JSONB DEFAULT '[]',
    digital_items TEXT[],
    processing_time VARCHAR(100) NOT NULL,
    default_printing_cost DECIMAL(15,2),
    default_transport_cost DECIMAL(15,2),
    photographers VARCHAR(100),
    videographers VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add-ons table
CREATE TABLE add_ons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards table
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_holder_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    last_four_digits VARCHAR(4) NOT NULL,
    expiry_date VARCHAR(7),
    balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    color_gradient VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial pockets table
CREATE TABLE financial_pockets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    goal_amount DECIMAL(15,2),
    lock_end_date DATE,
    source_card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_type VARCHAR(100) NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
    add_ons JSONB DEFAULT '[]',
    date DATE NOT NULL,
    deadline_date DATE,
    location VARCHAR(500) NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(100) NOT NULL,
    active_sub_statuses TEXT[],
    total_cost DECIMAL(15,2) NOT NULL,
    amount_paid DECIMAL(15,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(50) NOT NULL,
    team JSONB DEFAULT '[]',
    notes TEXT,
    accommodation TEXT,
    drive_link TEXT,
    client_drive_link TEXT,
    final_drive_link TEXT,
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    image TEXT,
    revisions JSONB DEFAULT '[]',
    promo_code_id UUID,
    discount_amount DECIMAL(15,2),
    shipping_details TEXT,
    dp_proof_url TEXT,
    printing_details JSONB DEFAULT '[]',
    printing_cost DECIMAL(15,2),
    transport_cost DECIMAL(15,2),
    is_editing_confirmed_by_client BOOLEAN DEFAULT FALSE,
    is_printing_confirmed_by_client BOOLEAN DEFAULT FALSE,
    is_delivery_confirmed_by_client BOOLEAN DEFAULT FALSE,
    confirmed_sub_statuses TEXT[],
    client_sub_status_notes JSONB DEFAULT '{}',
    sub_status_confirmation_sent_at JSONB DEFAULT '{}',
    completed_digital_items TEXT[],
    invoice_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    method VARCHAR(50) NOT NULL,
    pocket_id UUID REFERENCES financial_pockets(id) ON DELETE SET NULL,
    card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
    printing_item_id VARCHAR(100),
    vendor_signature TEXT,
    team_member_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_channel VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contracts table
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    signing_date DATE NOT NULL,
    signing_location VARCHAR(255) NOT NULL,
    client_name1 VARCHAR(255) NOT NULL,
    client_address1 TEXT NOT NULL,
    client_phone1 VARCHAR(50) NOT NULL,
    client_name2 VARCHAR(255),
    client_address2 TEXT,
    client_phone2 VARCHAR(50),
    shooting_duration TEXT NOT NULL,
    guaranteed_photos TEXT NOT NULL,
    album_details TEXT NOT NULL,
    digital_files_format TEXT NOT NULL,
    other_items TEXT NOT NULL,
    personnel_count TEXT NOT NULL,
    delivery_timeframe TEXT NOT NULL,
    dp_date DATE NOT NULL,
    final_payment_date DATE NOT NULL,
    cancellation_policy TEXT NOT NULL,
    jurisdiction VARCHAR(255) NOT NULL,
    vendor_signature TEXT,
    client_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    purchase_date DATE NOT NULL,
    purchase_price DECIMAL(15,2) NOT NULL,
    serial_number VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client feedback table
CREATE TABLE client_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    satisfaction VARCHAR(50) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    icon VARCHAR(50) NOT NULL,
    link_view VARCHAR(100),
    link_action JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media posts table
CREATE TABLE social_media_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    post_type VARCHAR(50) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    scheduled_date DATE NOT NULL,
    caption TEXT NOT NULL,
    media_url TEXT,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo codes table
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(15,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    usage_count INTEGER NOT NULL DEFAULT 0,
    max_usage INTEGER,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SOPs table
CREATE TABLE sops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    last_updated DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team project payments table
CREATE TABLE team_project_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    team_member_name VARCHAR(255) NOT NULL,
    team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Paid', 'Unpaid')) DEFAULT 'Unpaid',
    fee DECIMAL(15,2) NOT NULL DEFAULT 0,
    reward DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team payment records table
CREATE TABLE team_payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_number VARCHAR(100) UNIQUE NOT NULL,
    team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    project_payment_ids UUID[] NOT NULL DEFAULT '{}',
    total_amount DECIMAL(15,2) NOT NULL,
    vendor_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward ledger entries table
CREATE TABLE reward_ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL, -- positive for deposit, negative for withdrawal
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    bank_account VARCHAR(255) NOT NULL,
    authorized_signer VARCHAR(255) NOT NULL,
    id_number VARCHAR(50),
    bio TEXT NOT NULL,
    income_categories TEXT[] NOT NULL DEFAULT '{}',
    expense_categories TEXT[] NOT NULL DEFAULT '{}',
    project_types TEXT[] NOT NULL DEFAULT '{}',
    event_types TEXT[] NOT NULL DEFAULT '{}',
    asset_categories TEXT[] NOT NULL DEFAULT '{}',
    sop_categories TEXT[] NOT NULL DEFAULT '{}',
    project_status_config JSONB NOT NULL DEFAULT '[]',
    notification_settings JSONB NOT NULL DEFAULT '{}',
    security_settings JSONB NOT NULL DEFAULT '{}',
    briefing_template TEXT NOT NULL,
    terms_and_conditions TEXT,
    contract_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_clients_portal_access_id ON clients(portal_access_id);
CREATE INDEX idx_team_members_portal_access_id ON team_members(portal_access_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_date ON projects(date);
CREATE INDEX idx_transactions_project_id ON transactions(project_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_team_member_id ON transactions(team_member_id);
CREATE INDEX idx_contracts_client_id ON contracts(client_id);
CREATE INDEX idx_contracts_project_id ON contracts(project_id);
CREATE INDEX idx_social_media_posts_project_id ON social_media_posts(project_id);
CREATE INDEX idx_team_project_payments_team_member_id ON team_project_payments(team_member_id);
CREATE INDEX idx_team_project_payments_project_id ON team_project_payments(project_id);
CREATE INDEX idx_team_payment_records_team_member_id ON team_payment_records(team_member_id);
CREATE INDEX idx_reward_ledger_entries_team_member_id ON reward_ledger_entries(team_member_id);
CREATE INDEX idx_reward_ledger_entries_date ON reward_ledger_entries(date);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_add_ons_updated_at BEFORE UPDATE ON add_ons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_financial_pockets_updated_at BEFORE UPDATE ON financial_pockets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_client_feedback_updated_at BEFORE UPDATE ON client_feedback FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_social_media_posts_updated_at BEFORE UPDATE ON social_media_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sops_updated_at BEFORE UPDATE ON sops FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_team_project_payments_updated_at BEFORE UPDATE ON team_project_payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_team_payment_records_updated_at BEFORE UPDATE ON team_payment_records FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reward_ledger_entries_updated_at BEFORE UPDATE ON reward_ledger_entries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default data
INSERT INTO profiles (id, full_name, email, phone, company_name, website, address, bank_account, authorized_signer, bio, income_categories, expense_categories, project_types, event_types, asset_categories, sop_categories, project_status_config, notification_settings, security_settings, briefing_template) VALUES 
('50a48c47-9c07-4c69-9202-cd9c0c58828c', 'Admin Vena', 'admin@venapictures.com', '081234567890', 'Vena Pictures', 'https://venapictures.com', 'Jl. Raya Fotografi No. 123, Jakarta, Indonesia', 'BCA 1234567890 a/n Vena Pictures', 'Vena Pictures Management', 'Vendor fotografi pernikahan profesional dengan spesialisasi pada momen-momen otentik dan sinematik.', 
'{"DP Proyek","Pelunasan Proyek","Penjualan Album","Sewa Alat","Lain-lain","Modal"}', 
'{"Gaji Freelancer","Hadiah Freelancer","Penarikan Hadiah Freelancer","Sewa Tempat","Transportasi","Konsumsi","Marketing","Sewa Alat","Cetak Album","Cetak Foto","Flashdisk","Custom","Operasional Kantor","Transfer Internal","Penutupan Anggaran"}',
'{"Pernikahan","Pre-wedding","Lamaran","Acara Korporat","Ulang Tahun"}',
'{"Meeting Klien","Survey Lokasi","Libur","Workshop","Lainnya"}',
'{"Kamera","Lensa","Drone","Lighting","Audio","Tripod & Stabilizer","Lainnya"}',
'{"Fotografi","Videografi","Editing","Umum","Layanan Klien"}',
'[{"id":"status_1","name":"Tertunda","color":"#eab308","subStatuses":[{"name":"Menunggu DP","note":"Klien belum melakukan pembayaran uang muka."},{"name":"Jadwal Bentrok","note":"Perlu koordinasi ulang jadwal dengan klien atau tim."}],"note":"Proyek yang masih menunggu konfirmasi pembayaran atau penjadwalan ulang."},{"id":"status_3","name":"Dikonfirmasi","color":"#3b82f6","subStatuses":[{"name":"DP Lunas","note":"Uang muka sudah diterima."},{"name":"Kontrak Ditandatangani","note":"Dokumen kontrak sudah disetujui kedua belah pihak."}],"note":"Proyek siap dieksekusi."},{"id":"status_2","name":"Persiapan","color":"#6366f1","subStatuses":[{"name":"Briefing Tim","note":"Pastikan semua anggota tim memahami rundown dan tugas."},{"name":"Survey Lokasi","note":"Kunjungi lokasi acara untuk perencanaan teknis."},{"name":"Cek Peralatan","note":"Pastikan semua gear dalam kondisi prima dan baterai penuh."}],"note":"Tahap persiapan sebelum hari H acara."},{"id":"status_4","name":"Editing","color":"#8b5cf6","subStatuses":[{"name":"Seleksi Foto","note":"Memilih foto-foto terbaik dari acara."},{"name":"Editing Foto","note":"Proses color grading dan retouching foto."},{"name":"Editing Video","note":"Menyusun klip video menjadi satu kesatuan cerita."},{"name":"Color Grading","note":"Menyesuaikan warna video agar sinematik."}],"note":"Proses pasca-produksi sedang berjalan."},{"id":"status_5","name":"Revisi","color":"#14b8a6","subStatuses":[{"name":"Revisi Klien 1","note":"Menerima dan mengerjakan masukan revisi dari klien."},{"name":"Revisi Internal","note":"Pengecekan kualitas internal sebelum finalisasi."},{"name":"Finalisasi","note":"Menyelesaikan sentuhan akhir setelah semua revisi."}],"note":"Tahap revisi berdasarkan masukan klien atau internal."},{"id":"status_6","name":"Cetak","color":"#f97316","subStatuses":[{"name":"Layouting Album","note":"Menyusun tata letak foto pada album."},{"name":"Proses Cetak","note":"File dikirim ke percetakan."},{"name":"Quality Control","note":"Memeriksa hasil cetakan untuk memastikan kualitas."}],"note":"Proses pencetakan item fisik."},{"id":"status_7","name":"Dikirim","color":"#06b6d4","subStatuses":[{"name":"Packing","note":"Mengemas hasil fisik dengan aman."},{"name":"Dalam Pengiriman","note":"Paket sudah diserahkan ke kurir."}],"note":"Hasil fisik sedang dalam perjalanan ke klien."},{"id":"status_8","name":"Selesai","color":"#10b981","subStatuses":[],"note":"Proyek telah selesai dan semua hasil telah diterima klien."},{"id":"status_9","name":"Dibatalkan","color":"#ef4444","subStatuses":[],"note":"Proyek dibatalkan oleh klien atau vendor."}]',
'{"newProject":true,"paymentConfirmation":true,"deadlineReminder":true}',
'{"twoFactorEnabled":false}',
'Tim terbaik! Mari berikan yang terbaik untuk klien kita. Jaga semangat, komunikasi, dan fokus pada detail. Let''s create magic!');

-- Row Level Security (RLS) - Optional, can be enabled later
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- (Add more RLS policies as needed)
