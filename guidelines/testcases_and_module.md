akan ada menu testcase pada side bar, dan ketika di klik akan menampilkan list dari testcase. disana akan ada dropdown untuk module juga nama user. sehingga bisa memilih berdasarkan nama module dan user. nanti akan menampilkan list testcase. secara default akan menampilkan list testcase dari user yang login. ada menu search juga untuk testcase.

setiap user bisa melakukan add testcase. 
user juga bisa meng-update dan menghapus testcase yang mereka buat. 
user bisa meng-update testcase yang dibuat oleh user lain, namun user pembuat akan mendapatkan notifikasi bahwa testcasenya di update oleh user lain. 

akan ada form add dan update testcase, dalam satu testcase ada beberapa kolom yaitu :
- Nama Testcase
- Module
- Deskripsi
- Precondition
- Step (sama seperti detail testcase pada modul)
- Expected Result (sama seperti detail testcase pada modul)
- Priority
- Created By (otomatis nama user yg login)
- Created At (otomatis)
- Updated By (otomatis nama user yg login)
- Updated At (otomatis)

testcase id: 
auto generate berdasarkan prefix dari module yang di pilih. contoh: jika module nya adalah Login, maka testcase id nya akan diawali dengan prefix yg sudah di set pada modul. formatnya sama seperti testcase id di modul.

module: 
dropdown dari module yang sudah ada. dan QA member tidak bisa melakukan add module. tapi Lead dan Admin bisa.

namun ada hal yang berbeda saat add dan update testcase. 
saat add testcase, maka module tidak bisa diubah. karena module akan mempengaruhi testcase id. 

ketika add dan update testcase, maka module dan testcase id tidak bisa diubah.
ketika user lain menghapus testcase, maka testcase tersebut bisa di revive oleh user pembuat. admin, lead, owner bisa menghapus testcase selamanya.

ketika add testcase, maka otomatis testcase tersebut masuk ke dalam module yang dipilih. dan juga di module tersebut ada tab testcase yang berisikan list testcase dari module tersebut. 

dalam list testcase pada module, akan ada icon edit dan delete. dan jika di klik akan masuk ke form update dan delete testcase. 

jadi akan ada 2 menu, yaitu list testcase dan detail module. 
- List testcase: untuk menampilkan list testcase berdasarkan nama module dan user.
- Detail module: untuk menampilkan list testcase dari module yang dipilih. 

hanya ketika testcase sudah di assign pada sebuah session, baru testcase tersebut bisa ada status nya. jadi menu testcase hanya berfokus untuk manage testcase. 
