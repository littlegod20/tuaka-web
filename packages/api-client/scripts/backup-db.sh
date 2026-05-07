#!/bin/bash

# TuaKa database backup script
# Run via cron: 0 2 * * * /path/to/backup-db.sh

set -e

DB_NAME="tuaka"
DB_USER="postgres"
BACKUP_DIR="/var/backups/tuaka"
DATE=$(date +%Y-%m-%d-%H%M%S)
FILENAME="tuaka-db-${DATE}.sql.gz"
KEEP_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Dump and compress
pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "✓ Backup created: ${FILENAME}"

# Delete backups older than KEEP_DAYS
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +${KEEP_DAYS} -delete

echo "✓ Old backups cleaned up (kept last ${KEEP_DAYS} days)"