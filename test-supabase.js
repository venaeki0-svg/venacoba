
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import crypto from 'crypto'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('Environment check:')
console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing')
console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Present' : 'Missing')

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseConnection() {
  console.log('\nTesting Supabase connection...')
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing')
  
  try {
    // Test connection by trying to fetch from profiles table
    const { data, error } = await supabase.from('profiles').select('*').limit(1)
    
    if (error) {
      console.error('Connection error:', error)
      return false
    }
    
    console.log('Connection successful! Sample data:', data)
    return true
  } catch (err) {
    console.error('Connection failed:', err)
    return false
  }
}

async function testCreateClient() {
  console.log('\nTesting client creation...')
  try {
    const testClient = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '081234567890',
      since: '2024-01-15',
      instagram: '@testclient',
      status: 'Aktif',
      client_type: 'Langsung',
      last_contact: '2024-01-15',
      portal_access_id: crypto.randomUUID()
    }
    
    console.log('Creating client with data:', testClient)
    const { data, error } = await supabase.from('clients').insert(testClient).select().single()
    
    if (error) {
      console.error('Create error:', error)
      return false
    }
    
    console.log('Create successful:', data)
    
    // Delete test client
    const { error: deleteError } = await supabase.from('clients').delete().eq('id', data.id)
    if (deleteError) {
      console.error('Delete error:', deleteError)
    } else {
      console.log('Test client deleted')
    }
    
    return true
  } catch (err) {
    console.error('Create failed:', err)
    return false
  }
}

async function testListClients() {
  console.log('\nTesting list clients...')
  try {
    const { data, error } = await supabase.from('clients').select('*').limit(5)
    
    if (error) {
      console.error('List error:', error)
      return false
    }
    
    console.log('Existing clients:', data.length)
    console.log('Sample clients:', data.slice(0, 2))
    return true
  } catch (err) {
    console.error('List failed:', err)
    return false
  }
}

// Run tests
async function runAllTests() {
  try {
    const connectionOk = await testSupabaseConnection()
    if (!connectionOk) {
      console.log('Connection test failed, stopping...')
      return
    }
    
    await testListClients()
    await testCreateClient()
    
    console.log('\nAll tests completed!')
  } catch (err) {
    console.error('Test suite failed:', err)
  }
}

runAllTests()
