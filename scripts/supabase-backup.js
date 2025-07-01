#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || 'jsxupnogyvfynjgkwdyj';

// Backup configuration
const BACKUP_DIR = './backups';
const TIMESTAMP = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const BACKUP_PATH = `${BACKUP_DIR}/${TIMESTAMP}`;

// Tables to backup (add/remove as needed)
const TABLES_TO_BACKUP = [
  'tasks',
  'meetings', 
  'summaries',
  'memory_embeddings',
  'memory_search_logs',
  'user_summaries',
  'zoom_meetings'
];

// Initialize Supabase client
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL (or VITE_SUPABASE_URL)');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Logger utility
const logger = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.warn(`⚠️  ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  debug: (msg) => console.log(`🔍 ${msg}`)
};

// Create backup directory
async function ensureBackupDir() {
  try {
    await fs.mkdir(BACKUP_PATH, { recursive: true });
    logger.success(`Created backup directory: ${BACKUP_PATH}`);
  } catch (error) {
    logger.error(`Failed to create backup directory: ${error.message}`);
    throw error;
  }
}

// Backup database schema using Supabase CLI
async function backupSchema() {
  try {
    logger.info('Backing up database schema...');
    
    const schemaOutput = execSync('npx supabase db dump --schema-only', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    const schemaPath = path.join(BACKUP_PATH, 'schema.sql');
    await fs.writeFile(schemaPath, schemaOutput);
    
    logger.success(`Schema backup saved to: ${schemaPath}`);
    return schemaPath;
  } catch (error) {
    logger.error(`Schema backup failed: ${error.message}`);
    throw error;
  }
}

// Backup data for a specific table
async function backupTable(tableName) {
  try {
    logger.info(`Backing up table: ${tableName}`);
    
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' });
    
    if (error) {
      logger.warning(`Failed to backup table ${tableName}: ${error.message}`);
      return { tableName, success: false, error: error.message, count: 0 };
    }
    
    const tablePath = path.join(BACKUP_PATH, `${tableName}.json`);
    await fs.writeFile(tablePath, JSON.stringify(data, null, 2));
    
    logger.success(`Table ${tableName} backed up: ${count} records`);
    return { tableName, success: true, count, path: tablePath };
  } catch (error) {
    logger.error(`Table backup failed for ${tableName}: ${error.message}`);
    return { tableName, success: false, error: error.message, count: 0 };
  }
}

// Backup all table data
async function backupAllTables() {
  logger.info('Starting table data backup...');
  
  const results = [];
  for (const table of TABLES_TO_BACKUP) {
    const result = await backupTable(table);
    results.push(result);
  }
  
  return results;
}

// Generate backup manifest
async function generateManifest(tableResults, schemaPath) {
  const manifest = {
    timestamp: new Date().toISOString(),
    backup_path: BACKUP_PATH,
    supabase_project_id: SUPABASE_PROJECT_ID,
    schema: {
      path: schemaPath,
      size: (await fs.stat(schemaPath)).size
    },
    tables: tableResults.map(result => ({
      name: result.tableName,
      success: result.success,
      record_count: result.count,
      error: result.error || null,
      file_path: result.path || null
    })),
    summary: {
      total_tables: tableResults.length,
      successful_tables: tableResults.filter(r => r.success).length,
      failed_tables: tableResults.filter(r => !r.success).length,
      total_records: tableResults.reduce((sum, r) => sum + (r.count || 0), 0)
    }
  };
  
  const manifestPath = path.join(BACKUP_PATH, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  
  logger.success(`Backup manifest saved: ${manifestPath}`);
  return manifest;
}

// Main backup function
async function performBackup() {
  const startTime = Date.now();
  
  try {
    logger.info(`🚀 Starting Supabase backup at ${new Date().toISOString()}`);
    logger.info(`Project ID: ${SUPABASE_PROJECT_ID}`);
    
    // Create backup directory
    await ensureBackupDir();
    
    // Backup schema
    const schemaPath = await backupSchema();
    
    // Backup table data
    const tableResults = await backupAllTables();
    
    // Generate manifest
    const manifest = await generateManifest(tableResults, schemaPath);
    
    // Print summary
    const duration = Date.now() - startTime;
    logger.success(`\n📊 Backup Summary:`);
    logger.info(`   Duration: ${Math.round(duration / 1000)}s`);
    logger.info(`   Schema: Backed up`);
    logger.info(`   Tables: ${manifest.summary.successful_tables}/${manifest.summary.total_tables} successful`);
    logger.info(`   Records: ${manifest.summary.total_records} total`);
    logger.info(`   Location: ${BACKUP_PATH}`);
    
    if (manifest.summary.failed_tables > 0) {
      logger.warning(`\n⚠️  Failed Tables:`);
      tableResults
        .filter(r => !r.success)
        .forEach(r => logger.warning(`   ${r.tableName}: ${r.error}`));
    }
    
    logger.success(`\n🎉 Backup completed successfully!`);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`\n💥 Backup failed after ${Math.round(duration / 1000)}s`);
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  performBackup();
}

export { performBackup }; 