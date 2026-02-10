

## 🗃️ **Backup Script (`backup.sh`)**

### **İki farklı yedekleme yöntemi:**

1. **MongoDB Dump (Önerilen)**
   - MongoDB çalışırken yedekleme yapabilir
   - Sadece kullanıcı veritabanlarını yedekler
   - Daha güvenli ve hızlı

2. **Dosya Sistemi Yedekleme**
   - Tüm mongo-data klasörünü yedekler
   - MongoDB'yi durdurmak gerekir
   - Daha kapsamlı ama riskli

### **Kullanım örnekleri:**
```bash
# Varsayılan dump yedekleme (tarih damgası ile)
./backup.sh

# İsimli dump yedekleme
./backup.sh dump my_backup_20241014

# Dosya sistemi yedeklemesi
./backup.sh files system_backup

# Yardım
./backup.sh --help
```

## 🔄 **Restore Script (`restore.sh`)**

### **İki farklı geri yükleme yöntemi:**

1. **MongoDB Dump Geri Yükleme**
   - Seçici veritabanı geri yükleme
   - Mevcut verilerle birleştirme seçeneği
   - Daha güvenli

2. **Dosya Sistemi Geri Yükleme**
   - Tüm verileri değiştirir
   - Mevcut verilerden otomatik yedek alır
   - Daha kapsamlı ama riskli

### **Kullanım örnekleri:**
```bash
# İnteraktif mod (mevcut yedekleri listeler)
./restore.sh

# Dump dosyasından geri yükleme
./restore.sh dump ./backups/mongodb_dump_20241014.tar.gz

# Dosya sisteminden geri yükleme
./restore.sh files ./backups/mongodb_files_20241014.tar.gz
```

## 🛡️ **Güvenlik Özellikleri:**

- ✅ Onay istekleri (tehlikeli işlemler için)
- ✅ Mevcut verilerin otomatik yedeklenmesi
- ✅ Detaylı loglama ve renkli çıktı
- ✅ Hata kontrolü ve güvenli çıkış
- ✅ Docker konteyner durumu kontrolü

## 📁 **Klasör Yapısı:**
```
infrastructure/
├── backup.sh          # Yedekleme scripti
├── restore.sh          # Geri yükleme scripti
├── backups/            # Yedekler burada saklanır (otomatik oluşur)
├── mongo-data/         # MongoDB verileri
└── docker-compose-unubs.yml
```


**Hızlı hatırlatma:**
- İlk backup için: `./backup.sh` (varsayılan dump yöntemi)
- Yedekleri görmek için: `./restore.sh` 
- Yardım için: `./backup.sh --help` veya `./restore.sh --help`

MongoDB verilerinin güvenliği önemli, bu yüzden scriptler güvenlik önlemleri alıyor ve her adımda bilgi veriyor. 
