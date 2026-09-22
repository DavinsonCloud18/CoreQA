## Modul Manajemen Akun (User Management)

Menu user digunakan untuk melakukan CRUD Account yang ada di dalam database. Data terhubung langsung dengan database. User yang ada di database adalah user yang dapat login ke dalam sistem. Setiap user memiliki role (contoh: Admin, QA Member, Leader) dan status (Aktif / Tidak Aktif).

### Hak Akses (Role-Based Access Control)

**Admin:**
- Dapat melakukan operasi CRUD (Create, Read, Update, Delete) secara penuh terhadap semua entitas: **User, Role, dan Status**.
- Dapat menambahkan, mengubah, atau menghapus user dengan role apapun (termasuk Admin lain, Leader, atau QA Member).

**Leader QA:**
- **Manajemen User**:
  - Dapat **menambahkan** user baru, tetapi HANYA bisa memberikan role **QA Member**.
  - Dapat **menghapus** user, tetapi HANYA user dengan role **QA Member**.
  - Dapat **mengubah** data user, tetapi HANYA user dengan role **QA Member**, dan HANYA bisa mengubah status **Aktif / Tidak Aktif** (tidak bisa merubah nama, email, password, dll).
  - Sama sekali **tidak bisa** mengedit atau menghapus Admin atau Leader lain.
- Dapat melakukan CRUD terhadap testcase, module, dan session.

**QA Member (QA):**
- **Manajemen User**: Tidak bisa melakukan manajemen user, mengubah role, atau mengubah status user sama sekali.
- Dapat melakukan CRUD terhadap testcase.
