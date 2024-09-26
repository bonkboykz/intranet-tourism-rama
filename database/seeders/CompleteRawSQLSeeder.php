<?php

namespace Database\Seeders;

use File;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Output\ConsoleOutput;

class CompleteRawSQLSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Raw SQL to create new_users_data_offiria table
        DB::statement("
            CREATE TABLE IF NOT EXISTS new_users_data_offiria (
                id SERIAL PRIMARY KEY,
                user_id INT UNIQUE,
                name VARCHAR(255),
                username VARCHAR(255),
                email VARCHAR(255),
                image_file_name VARCHAR(255),
                title VARCHAR(255),
                gred VARCHAR(255),
                division VARCHAR(255),
                unit VARCHAR(255),
                lokasi VARCHAR(255),
                work_phone VARCHAR(255),
                ordering VARCHAR(255),
                taraf_jawatan VARCHAR(255),
                active_status VARCHAR(255)
            );
        ");

        // Truncate the table before seeding
        DB::table('new_users_data_offiria')->truncate();

        // Path to the CSV file
        $csvFile = base_path('seed/new_user_data.csv');

        // Read the CSV file and insert data
        if (File::exists($csvFile)) {
            $data = array_map('str_getcsv', file($csvFile));

            foreach ($data as $row) {
                // skip first row
                if ($row[0] === 'id') {
                    continue;
                }

                if (!$row[0] || !is_numeric($row[0])) {
                    continue;
                }

                DB::table('new_users_data_offiria')->insert([
                    'user_id' => $row[0],
                    'name' => $row[1],
                    'username' => $row[2],
                    'email' => $row[3],
                    'image_file_name' => $row[4],
                    'title' => $row[5],
                    'gred' => $row[6],
                    'division' => $row[7],
                    'unit' => $row[8],
                    'lokasi' => $row[9],
                    'work_phone' => $row[10],
                    'ordering' => $row[11],
                    'taraf_jawatan' => $row[12],
                    'active_status' => $row[13],
                ]);
            }
        }

        // Raw SQL to create updated_staff_data table
        DB::statement("
            CREATE TABLE IF NOT EXISTS updated_staff_data (
                id SERIAL PRIMARY KEY,
                url VARCHAR(255),
                image_name VARCHAR(255),
                user_id INT UNIQUE,
                user_name VARCHAR(255),
                work_phone VARCHAR(255),
                active_status VARCHAR(255)
            );
        ");

        // Truncate the table before seeding
        DB::table('updated_staff_data')->truncate();

        // Path to the CSV file
        $csvFile = base_path('seed/UpdatedListAvatarExtract.csv');

        // Read the CSV file and insert data
        if (File::exists($csvFile)) {
            $data = array_map('str_getcsv', file($csvFile));

            foreach ($data as $row) {
                // skip first row
                if (strpos($row[0], ('URL Picture Jomla')) !== false) {
                    continue;
                }

                if (!$row[3] || !is_numeric($row[3])) {
                    continue;
                }


                DB::table('updated_staff_data')->insert([
                    'url' => $row[0],
                    'image_name' => $row[1],
                    'user_id' => $row[2],
                    'user_name' => $row[3],
                    'work_phone' => $row[4],
                    'active_status' => $row[5],
                ]);
            }
        }

        // Raw SQL to insert data from new_users_data_offiria into users table
        DB::statement("
            INSERT INTO users (id, email, password, name, username, is_active)
            SELECT
                u.user_id,
                u.email,
                'default_password' AS password,
                u.name,
                u.username,
                CASE
                    WHEN CAST(u.active_status AS INTEGER) = 1 THEN TRUE
                    ELSE FALSE
                END AS is_active
            FROM
                new_users_data_offiria u
            WHERE
                u.email IS NOT NULL
                AND TRIM(u.email) <> ''
            ON CONFLICT (email) DO NOTHING;
        ");

        // Raw SQL to insert into profiles table
        DB::statement("
            INSERT INTO profiles (user_id, bio, staff_image)
            SELECT ud.user_id, ud.name, ud.image_file_name
            FROM new_users_data_offiria ud
            WHERE EXISTS (
                SELECT 1
                FROM users u
                WHERE u.id = ud.user_id
            );
        ");

        // Raw SQL to update profiles with updated_staff_data
        DB::statement("
            UPDATE profiles
            SET staff_image = usd.image_name
            FROM updated_staff_data usd
            WHERE profiles.user_id = usd.user_id;
        ");

        // Raw SQL to insert into departments table
        DB::statement("
            INSERT INTO departments (name)
            SELECT DISTINCT division
            FROM new_users_data_offiria
            WHERE division IS NOT NULL;
        ");

        // Raw SQL to insert into business_grades table
        DB::statement("
            INSERT INTO business_grades (code)
            SELECT DISTINCT gred
            FROM new_users_data_offiria
            WHERE gred IS NOT NULL;
        ");

        // Raw SQL to insert predefined posts into business_posts table
        DB::statement("
            INSERT INTO business_posts (title)
            VALUES
                ('Pengerusi'),
                ('Timbalan Pengerusi'),
                ('Ketua Pengarah'),
                ('Timbalan Ketua Pengarah'),
                ('Pengarah Kanan'),
                ('Pengarah'),
                ('Timbalan Pengarah Kanan'),
                ('Timbalan Pengarah'),
                ('Penolong Pengarah Kanan'),
                ('Penolong Pengarah'),
                ('Pegawai Pelancongan Tertinggi'),
                ('Pegawai Pelancongan Kanan'),
                ('Pegawai Pelancongan'),
                ('Penolong Pegawai Tadbir Tertinggi'),
                ('Penolong Pegawai Tadbir Kanan'),
                ('Penolong Pegawai Tadbir'),
                ('Pembantu Tadbir Tertinggi'),
                ('Pembantu Tadbir Kanan'),
                ('Pembantu Tadbir'),
                ('Setiausaha Pejabat'),
                ('Pembantu Setiausaha Pejabat'),
                ('Pegawai Penyelidik'),
                ('Pereka Grafik Kanan'),
                ('Pereka Grafik'),
                ('Pereka Tertinggi'),
                ('Pereka Kanan'),
                ('Pereka'),
                ('Jurufoto Tertinggi'),
                ('Jurufoto Kanan'),
                ('Jurufoto'),
                ('Pegawai Teknologi Maklumat Kanan'),
                ('Pegawai Teknologi Maklumat'),
                ('Penolong Pegawai Teknologi Maklumat Tertinggi'),
                ('Penolong Pegawai Teknologi Maklumat Kanan'),
                ('Penolong Pegawai Teknologi Maklumat'),
                ('Akauntan Kanan'),
                ('Akauntan'),
                ('Penolong Akauntan Tertinggi'),
                ('Penolong Akauntan Kanan'),
                ('Penolong Akauntan'),
                ('Pegawai Kewangan'),
                ('Pegawai Khas'),
                ('Pegawai Pemasaran'),
                ('Pembantu Operasi Kanan'),
                ('Pembantu Operasi'),
                ('Pemandu Kanan'),
                ('Pemandu'),
                ('Pengarah Luar Negeri'),
                ('Timbalan Pengarah Luar Negeri'),
                ('Assistant Marketing Officer'),
                ('Clerk'),
                ('Clerk / Typist'),
                ('Driver'),
                ('Driver / Office Assistant'),
                ('Driver / Packer'),
                ('Driver/Office Assistant'),
                ('Editor'),
                ('Eksekutif Pemasaran'),
                ('Eksekutif Pemasaran (Pr & Media)'),
                ('Eksekutif Pemasaran Tm Almaty'),
                ('Juru Audit Kanan'),
                ('Jurufotografi'),
                ('Juruteknik Komputer'),
                ('Juruteknik Komputer Kanan'),
                ('Juruteknik Komputer Tertinggi'),
                ('Kerani'),
                ('Kerani / Jurutaip'),
                ('Kerani Kewangan & Pentadbiran'),
                ('Kerani Pentadbiran & Kewangan'),
                ('Kerani Pentadbiran/Kewangan'),
                ('Kerani/Jurutaip (Pentadbiran)'),
                ('Ketua Sekretariat Vm2020'),
                ('Ketua Unit Perundangan'),
                ('Marketing Executive'),
                ('Marketing Manager'),
                ('Marketing Officer'),
                ('Mystep'),
                ('Office Driver'),
                ('Pegawai Eksekutif'),
                ('Pegawai Kewangan Kanan'),
                ('Pegawai Khas Kepada Pengerusi Tm'),
                ('Pegawai Khidmat Pelanggan'),
                ('Pegawai Komunikasi'),
                ('Pegawai Pelancongan - Langkawi'),
                ('Pegawai Pelancongan Kanan (Kup)'),
                ('Pegawai Pelancongan Tertinggi I'),
                ('Pegawai Penyelidik (E29)'),
                ('Pegawai Psikologi'),
                ('Pegawai Undang-Undang (Ii)'),
                ('Pemandu / Pembantu Pejabat'),
                ('Pemandu Pejabat'),
                ('Pemandu/Packer'),
                ('Pemandu/Pembantu Am'),
                ('Pembantu Am Pejabat'),
                ('Pembantu Am Rendah Kanan'),
                ('Pembantu Pejabat'),
                ('Pembantu Pelancong Kanan'),
                ('Pembantu Pelancong Tertinggi'),
                ('Pembantu Pelancongan'),
                ('Pembantu Setiausaha Pejabat Kanan'),
                ('Pembantu Tadbir (P/0)'),
                ('Pembantu Tadbir (P/O) Kanan'),
                ('Pembantu Tadbir (Perkeranian/Operasi)'),
                ('Pembantu Tadbir (Perkeranian/Operasi) Tertinggi'),
                ('Pembantu Tadbir (P/O) Tertinggi'),
                ('Pembantu Tadbir Rendah Kanan'),
                ('Pembantu Tadbir Tertinggi (Kewangan)'),
                ('Pembantu Tadbir Tertinggi (Perkeranian/Operasi)'),
                ('Penasihat Pelancongan Kepada Ketua Setiausaha (Ksu)'),
                ('Penempatan Sementara'),
                ('Penganalisa Program'),
                ('Pengarah Kanan (Jusa C) Memangku'),
                ('Pengarah Kanan Pengurusan'),
                ('Pengarah Pejabat Luar Negeri'),
                ('Pengarah Pejabat Negeri'),
                ('Penolong  Pegawai Teknologi Maklumat'),
                ('Penolong Juruaudit'),
                ('Penolong Pengarah (Perundangan)'),
                ('Penolong Pengarah (Pinjaman)'),
                ('Penolong Pengarah - Penulis'),
                ('Penolong Pengarah Kanan (Tk Timbalan Pengarah)'),
                ('Penolong Pengurus Pemasaran'),
                ('Pentabdiran'),
                ('Penulis'),
                ('Penyunting Video'),
                ('Pereka Laman Web (Psh)'),
                ('Personal Mystep'),
                ('Personel'),
                ('Personel Mystep'),
                ('Publication Manager'),
                ('Publications Manager'),
                ('Receptionist'),
                ('Setiausaha Pejabat (Kup)'),
                ('Timb. Ketua Pengarah (Promosi)'),
                ('Timbalan Ketua Pengarah (Perancangan)'),
                ('Timbalan Pengarah Kanan (Pengurusan)'),
                ('Timbalan Pengarah Pejabat Tm Wilayah Selatan'),
                ('Timbalan Pengarah Tm Negeri'),
                ('Timbalan Pengerusi Tourism Malaysia'),
                ('Tourism Information Assistant'),
                ('Visualizer'),
                ('Writer');
        ");

        DB::statement("
            INSERT INTO business_schemes (title, code)
VALUES
    ('Test Business Scheme', 'BS');
        ");

        DB::statement("
INSERT INTO business_units (department_id, name)
SELECT DISTINCT d.id AS department_id, u.unit AS name
FROM new_users_data_offiria u
JOIN departments d ON u.division = d.name
WHERE u.unit IS NOT NULL
  AND u.unit <> ''
  AND (d.id, u.unit) NOT IN (
    SELECT department_id, name
    FROM business_units
  );
        ");

        DB::statement("
        INSERT INTO employment_posts (
            department_id,
            business_unit_id,
            business_post_id,
            business_grade_id,
            business_scheme_id,
            user_id,
            location,
            \"order\",
            work_phone,
            position
        )
        SELECT
            d.id AS department_id,
            COALESCE(bu.id, 1) AS business_unit_id,
            COALESCE(bp.id, 1) AS business_post_id,
            COALESCE(bg.id, 1) AS business_grade_id,
            1 AS business_scheme_id,
            u.id AS user_id,
            n.lokasi AS location,
            COALESCE(NULLIF(n.ordering, '')::integer, 0) AS \"order\",
            n.work_phone AS work_phone,
            n.taraf_jawatan AS position
        FROM
            new_users_data_offiria n
        INNER JOIN
            departments d ON n.division = d.name
        LEFT JOIN
            business_units bu ON d.id = bu.department_id AND n.unit = bu.name
        LEFT JOIN
            business_posts bp ON LOWER(n.title) = LOWER(bp.title)
        LEFT JOIN
            business_grades bg ON n.gred = bg.code
        LEFT JOIN
            users u ON n.email = u.email
        WHERE
            n.email IS NOT NULL;
    ");



        DB::statement("
-- Update id 1 for title to 'no title'
UPDATE business_posts SET title = 'No title' WHERE id = 1;
        ");

        // Raw SQL to insert into external_links table
        DB::statement("
            INSERT INTO external_links (label, url) VALUES
            ('Dashboard Tourism Malaysia', 'https://data.tourism.gov.my/'),
            ('e-Library', 'https://resourcecentre.tourism.gov.my/'),
            ('ERMS (Electronic Record Management System)', 'https://erms.tourism.gov.my/irekodv1/'),
            ('Executive Information System (EIS)', 'https://eis.tourism.gov.my/'),
            ('Google', 'http://google.com'),
            ('HRMIS', 'https://hrmis2.eghrmis.gov.my/HRMISNET/Common/Main/Login.aspx'),
            ('MyFIS 2.0', 'https://myfisv2.tourism.gov.my/'),
            ('MyFIS Lite 2.0: Pejabat Cawangan (Dalam Negeri/Luar Negeri)', 'https://myfislitev2.tourism.gov.my/login'),
            ('Office 365', 'http://portal.microsoftonline.com/'),
            ('Sistem G-Asset & G-Store', 'https://asset.tourism.gov.my'),
            ('Sistem Kehadiran Pejabat', 'https://kehadiran.tourism.gov.my/Forms/LoginUI.aspx'),
            ('Sistem Keluar Pejabat', 'https://keluarpejabat.tourism.gov.my/'),
            ('Sistem Laporan Pejabat Negeri', 'http://e-state.tourism.gov.my/'),
            ('Sistem Pengurusan Aduan Integriti', 'https://aduanintegriti.tourism.gov.my/'),
            ('Sistem Pengurusan Fasiliti', 'https://fasiliti.tourism.gov.my/'),
            ('Sistem Pengurusan Helpdesk', 'http://helpdesk.tourism.gov.my/'),
            ('Sistem Pengurusan Sumber Manusia', 'https://hr.tourism.gov.my/'),
            ('Sistem Permohonan Ke Luar Negara (Urusan Persendirian)', 'https://keluarnegara.tourism.gov.my/'),
            ('Sistem Pusat Pengedaran Tourism Malaysia', 'https://tmdc.tourism.gov.my/'),
            ('Sistem Tempahan Bilik Mesyuarat', 'https://meeting.tourism.gov.my/'),
            ('Sistem Tempahan Kenderaan', 'https://transport.tourism.gov.my/');
        ");

        // Alter the banner column in the communities table
        DB::statement("
            ALTER TABLE communities ALTER COLUMN banner TYPE text;
        ");

        // Update specific profile record
        DB::statement("
            UPDATE profiles SET staff_image = '2587.jpg' WHERE user_id = 1229;
        ");

        // Step 1: Get the max id from the users table
        $maxId = DB::table('users')->max('id') + 1;

        // Step 2: Restart the sequence with the max id value
        DB::statement("ALTER SEQUENCE public.users_id_seq RESTART WITH $maxId;");
    }
}