license is : AAAAA-AAAAA-AAAAA-AAAAA-AAAAA

home

- (v) dialog product table berdasarkan shift
- save produk to report
- (v) min_tolerance - netto - max_tolerance => OK
  netto -min_tolerance - max_tolerance => LOW
  min_tolerance - max_tolerance - netto => HIGH
- (v) simpan data report ke database local dan database server

- jika [v] dapat nyimpan ke 3 kondisi
- jika [!v] hanya dapat menyimpan dalam kondisi ok


role
admin -> bisa aksess semua
operator -> aksess home dan report

master

- sync data product ke database local
- sync data operator ke database local
- sync data shift ke database local

report

- sync data report ke database local

api

- tidak boleh data waktu yang sama dalam table shift

desain

- desktop desain
- server desain



- admin
login gk perlu pakai shift



