#!/bin/bash

# MongoDB Backup Script for Docker Environment
# Usage: ./backup.sh [method] [backup_name]
# Methods: dump (default) | files
# Example: ./backup.sh dump my_backup_20241014

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

# Create backup directory if it doesn't exist
prepare_backup_dir() {
    mkdir -p "$BACKUP_DIR"
    log_info "Backup directory: $BACKUP_DIR"
}

# Method 1: MongoDB dump (recommended - can be done while running)
backup_with_dump() {
    local backup_name=$1
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="${BACKUP_DIR}/${backup_name:-mongodb_dump_${timestamp}}.tar.gz"
    local temp_dir="/tmp/mongo_backup_${timestamp}"
    
    log_info "Starting MongoDB dump backup..."
    log_info "Backup file: $backup_file"
    
    # Create temporary directory
    mkdir -p "$temp_dir"
    
    # Get list of databases
    log_info "Getting list of databases..."
    databases=$(docker exec $MONGO_CONTAINER mongo --host $MONGO_HOST --port $MONGO_PORT -u $MONGO_USERNAME -p $MONGO_PASSWORD --authenticationDatabase admin --quiet --eval "db.adminCommand('listDatabases').databases.forEach(function(d){if(d.name!=='admin'&&d.name!=='local'&&d.name!=='config')print(d.name)})")
    
    if [ -z "$databases" ]; then
        log_warning "No user databases found to backup"
        return 1
    fi
    
    log_info "Found databases: $databases"
    
    # Dump each database
    for db in $databases; do
        log_info "Dumping database: $db"
        docker exec $MONGO_CONTAINER mongodump \
            --host $MONGO_HOST \
            --port $MONGO_PORT \
            --username $MONGO_USERNAME \
            --password $MONGO_PASSWORD \
            --authenticationDatabase admin \
            --db $db \
            --out /tmp/backup_dump
        
        # Copy dump from container to host
        docker cp $MONGO_CONTAINER:/tmp/backup_dump/$db "$temp_dir/"
    done
    
    # Create compressed archive
    log_info "Creating compressed archive..."
    tar -czf "$backup_file" -C "$temp_dir" .
    
    # Cleanup
    rm -rf "$temp_dir"
    docker exec $MONGO_CONTAINER rm -rf /tmp/backup_dump
    
    log_success "MongoDB dump backup completed: $backup_file"
    log_info "Backup size: $(du -h "$backup_file" | cut -f1)"
}

# Method 2: File system backup (requires stopping MongoDB)
backup_with_files() {
    local backup_name=$1
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="${BACKUP_DIR}/${backup_name:-mongodb_files_${timestamp}}.tar.gz"
    
    log_warning "File system backup requires stopping MongoDB container"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Backup cancelled"
        exit 0
    fi
    
    log_info "Starting file system backup..."
    log_info "Backup file: $backup_file"
    
    # Stop MongoDB container
    log_info "Stopping MongoDB container..."
    $DOCKER_COMPOSE_CMD -f $DOCKER_COMPOSE_FILE stop $MONGO_CONTAINER
    
    # Create backup
    log_info "Creating backup archive..."
    tar -czf "$backup_file" -C . mongo-data
    
    # Restart MongoDB container
    log_info "Restarting MongoDB container..."
    $DOCKER_COMPOSE_CMD -f $DOCKER_COMPOSE_FILE start $MONGO_CONTAINER
    
    log_success "File system backup completed: $backup_file"
    log_info "Backup size: $(du -h "$backup_file" | cut -f1)"
}

# Show usage
show_usage() {
    echo "Usage: $0 [method] [backup_name]"
    echo
    echo "Methods:"
    echo "  dump   - Create backup using mongodump (default, recommended)"
    echo "  files  - Create backup by copying mongo-data directory (requires stopping MongoDB)"
    echo
    echo "Examples:"
    echo "  $0                              # Create dump backup with timestamp"
    echo "  $0 dump my_backup               # Create named dump backup"
    echo "  $0 files system_backup          # Create file system backup"
    echo
    echo "Available backups:"
    if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
        ls -lh "$BACKUP_DIR"
    else
        echo "  No backups found"
    fi
}

# Main function
main() {
    local method=${1:-dump}
    local backup_name=$2
    
    case $method in
        dump)
            check_docker_compose
            prepare_backup_dir
            check_mongo_container
            backup_with_dump "$backup_name"
            ;;
        files)
            check_docker_compose
            prepare_backup_dir
            backup_with_files "$backup_name"
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