#!/bin/bash

# MongoDB Restore Script for Docker Environment
# Usage: ./restore.sh [method] [backup_file]
# Methods: dump (default) | files
# Example: ./restore.sh dump ./backups/my_backup_20241014.tar.gz

set -e

# Configuration
DOCKER_COMPOSE_FILE="docker-compose-unubs.yml"
MONGO_CONTAINER="my-mongodb"
MONGO_DATA_DIR="./mongo-data"
BACKUP_DIR="./backups"
MONGO_HOST="localhost"
MONGO_PORT="27017"
MONGO_USERNAME="admin"
MONGO_PASSWORD="admin"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if docker-compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    if docker compose version &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker compose"
    else
        DOCKER_COMPOSE_CMD="docker-compose"
    fi
}

# Check if MongoDB container is running
check_mongo_container() {
    if ! docker ps | grep -q "$MONGO_CONTAINER"; then
        log_error "MongoDB container '$MONGO_CONTAINER' is not running"
        log_info "Starting MongoDB container..."
        $DOCKER_COMPOSE_CMD -f $DOCKER_COMPOSE_FILE up -d $MONGO_CONTAINER
        sleep 10
    fi
}

# Check if backup file exists
check_backup_file() {
    local backup_file=$1
    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        list_available_backups
        exit 1
    fi
}

# List available backups
list_available_backups() {
    echo
    log_info "Available backups:"
    if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
        ls -lh "$BACKUP_DIR"
    else
        echo "  No backups found in $BACKUP_DIR"
    fi
}

# Method 1: Restore from MongoDB dump
restore_from_dump() {
    local backup_file=$1
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local temp_dir="/tmp/mongo_restore_${timestamp}"
    
    log_warning "This will restore databases from the backup file"
    log_warning "Existing data with the same database names will be overwritten!"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Restore cancelled"
        exit 0
    fi
    
    log_info "Starting MongoDB dump restore..."
    log_info "Backup file: $backup_file"
    
    # Create temporary directory and extract backup
    mkdir -p "$temp_dir"
    log_info "Extracting backup archive..."
    tar -xzf "$backup_file" -C "$temp_dir"
    
    # Copy extracted files to container
    log_info "Copying backup data to container..."
    docker cp "$temp_dir" $MONGO_CONTAINER:/tmp/restore_data
    
    # Find and restore each database
    for db_dir in "$temp_dir"/*; do
        if [ -d "$db_dir" ]; then
            db_name=$(basename "$db_dir")
            log_info "Restoring database: $db_name"
            
            # Drop existing database (optional - comment out if you want to merge)
            log_info "Dropping existing database: $db_name"
            docker exec $MONGO_CONTAINER mongo \
                --host $MONGO_HOST \
                --port $MONGO_PORT \
                -u $MONGO_USERNAME \
                -p $MONGO_PASSWORD \
                --authenticationDatabase admin \
                --eval "db.getSiblingDB('$db_name').dropDatabase()" \
                2>/dev/null || log_warning "Could not drop database $db_name (it might not exist)"
            
            # Restore database
            docker exec $MONGO_CONTAINER mongorestore \
                --host $MONGO_HOST \
                --port $MONGO_PORT \
                --username $MONGO_USERNAME \
                --password $MONGO_PASSWORD \
                --authenticationDatabase admin \
                --db $db_name \
                /tmp/restore_data/$db_name
        fi
    done
    
    # Cleanup
    rm -rf "$temp_dir"
    docker exec $MONGO_CONTAINER rm -rf /tmp/restore_data
    
    log_success "MongoDB dump restore completed successfully!"
}

# Method 2: Restore from file system backup
restore_from_files() {
    local backup_file=$1
    
    log_warning "This will completely replace all MongoDB data!"
    log_warning "All existing databases will be lost!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Restore cancelled"
        exit 0
    fi
    
    log_info "Starting file system restore..."
    log_info "Backup file: $backup_file"
    
    # Stop MongoDB container
    log_info "Stopping MongoDB container..."
    $DOCKER_COMPOSE_CMD -f $DOCKER_COMPOSE_FILE stop $MONGO_CONTAINER
    
    # Backup current data (just in case)
    if [ -d "$MONGO_DATA_DIR" ]; then
        local current_backup="mongo-data-backup-$(date +%Y%m%d_%H%M%S)"
        log_info "Creating backup of current data: $current_backup"
        mv "$MONGO_DATA_DIR" "$current_backup"
    fi
    
    # Extract backup
    log_info "Extracting backup archive..."
    tar -xzf "$backup_file" -C .
    
    # Set proper permissions
    log_info "Setting proper permissions..."
    sudo chown -R 999:999 "$MONGO_DATA_DIR" 2>/dev/null || log_warning "Could not set MongoDB user permissions"
    
    # Restart MongoDB container
    log_info "Starting MongoDB container..."
    $DOCKER_COMPOSE_CMD -f $DOCKER_COMPOSE_FILE start $MONGO_CONTAINER
    
    # Wait for MongoDB to be ready
    log_info "Waiting for MongoDB to be ready..."
    sleep 15
    
    log_success "File system restore completed successfully!"
}

# Show usage
show_usage() {
    echo "Usage: $0 [method] [backup_file]"
    echo
    echo "Methods:"
    echo "  dump   - Restore from mongodump backup (default, recommended)"
    echo "  files  - Restore from file system backup (replaces all data)"
    echo
    echo "Examples:"
    echo "  $0                                      # Show available backups"
    echo "  $0 dump ./backups/mongodb_dump.tar.gz  # Restore from dump backup"
    echo "  $0 files ./backups/mongodb_files.tar.gz # Restore from file backup"
    echo
    list_available_backups
}

# Interactive backup selection
select_backup_interactive() {
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
        log_error "No backups found in $BACKUP_DIR"
        exit 1
    fi
    
    echo
    log_info "Available backups:"
    backups=($(ls -1 "$BACKUP_DIR"))
    
    for i in "${!backups[@]}"; do
        echo "  $((i+1)). ${backups[$i]}"
    done
    
    echo
    read -p "Select backup number (1-${#backups[@]}): " selection
    
    if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "${#backups[@]}" ]; then
        echo "${BACKUP_DIR}/${backups[$((selection-1))]}"
    else
        log_error "Invalid selection"
        exit 1
    fi
}

# Main function
main() {
    local method=${1:-interactive}
    local backup_file=$2
    
    case $method in
        dump)
            if [ -z "$backup_file" ]; then
                backup_file=$(select_backup_interactive)
            fi
            check_backup_file "$backup_file"
            check_docker_compose
            check_mongo_container
            restore_from_dump "$backup_file"
            ;;
        files)
            if [ -z "$backup_file" ]; then
                backup_file=$(select_backup_interactive)
            fi
            check_backup_file "$backup_file"
            check_docker_compose
            restore_from_files "$backup_file"
            ;;
        interactive)
            show_usage
            ;;
        -h|--help|help)
            show_usage
            ;;
        *)
            log_error "Unknown method: $method"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"