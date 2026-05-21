import type { TourNode } from "../types/tour";

export const tourNodes: TourNode[] = [
  {
    id: "gerbang-kampus",
    name: "Gerbang Utama & Plaza",
    category: "Area Outdoor",
    description: "Gerbang utama kampus yang megah, menghubungkan area luar dengan pusat administrasi dan plaza utama. Tempat favorit mahasiswa untuk berkumpul dan mengambil foto.",
    panoramaUrl: "https://pannellum.org/images/tocopilla.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80",
    defaultYaw: 0,
    defaultPitch: 0,
    mapPosition: { x: 50, y: 85 },
    facilities: ["Pos Pengamanan 24 Jam", "Area Drop-off Bus Kampus", "Peta Kampus Interaktif", "Plaza Pertemuan"],
    navigationHotspots: [
      {
        id: "nav-gerbang-to-lobby",
        targetNodeId: "lobby-utama",
        label: "Masuk ke Lobby Utama Gedung Rektorat",
        yaw: 0.2,
        pitch: 0.05,
      },
      {
        id: "nav-gerbang-to-lapangan",
        targetNodeId: "lapangan-utama",
        label: "Menuju Science Dome Plaza",
        yaw: -0.8,
        pitch: -0.02,
      }
    ],
    infoHotspots: [
      {
        id: "info-gerbang-pos",
        label: "Pusat Informasi Keamanan",
        description: "Semua pengunjung wajib melapor dan menukarkan kartu identitas untuk mendapatkan kartu akses tamu di pos ini.",
        yaw: 0.8,
        pitch: 0.01,
      },
      {
        id: "info-gerbang-monumen",
        label: "Monumen Kebangsaan Kampus",
        description: "Monumen setinggi 15 meter yang melambangkan persatuan, ilmu pengetahuan, dan pengabdian masyarakat.",
        yaw: -1.8,
        pitch: 0.15,
      }
    ]
  },
  {
    id: "lobby-utama",
    name: "Lobby Utama & Art Gallery",
    category: "Gedung Utama",
    description: "Lobby ber-AC dengan langit-langit kubah kaca yang megah, memamerkan lukisan serta karya seni mahasiswa. Pusat administrasi, pendaftaran mahasiswa baru, dan ruang tunggu tamu.",
    panoramaUrl: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
    defaultYaw: 0,
    defaultPitch: 0,
    mapPosition: { x: 50, y: 60 },
    facilities: ["Resepsionis / Front Desk", "Lounge Pengunjung", "Galeri Seni Mahasiswa", "Koneksi Wi-Fi 1Gbps"],
    navigationHotspots: [
      {
        id: "nav-lobby-to-gerbang",
        targetNodeId: "gerbang-kampus",
        label: "Kembali ke Gerbang Utama",
        yaw: -2.8,
        pitch: -0.1,
      },
      {
        id: "nav-lobby-to-perpustakaan",
        targetNodeId: "perpustakaan",
        label: "Pergi ke Deck Outdoor Perpustakaan",
        yaw: 1.2,
        pitch: 0.05,
      }
    ],
    infoHotspots: [
      {
        id: "info-lobby-karya-seni",
        label: "Karya Seni Mahasiswa Terbaik",
        description: "Lukisan dinding raksasa bertema 'Masa Depan Berkelanjutan' yang dilukis oleh kolaborasi mahasiswa Seni Rupa angkatan terbaru.",
        yaw: -0.5,
        pitch: 0.1,
      },
      {
        id: "info-lobby-pendaftaran",
        label: "Helpdesk Penerimaan Mahasiswa Baru",
        description: "Layanan konsultasi program studi, biaya kuliah, pendaftaran, dan beasiswa dibuka setiap hari kerja pukul 08.00 - 16.00.",
        yaw: 2.2,
        pitch: -0.05,
      }
    ]
  },
  {
    id: "perpustakaan",
    name: "Teras Perpustakaan & Lembah",
    category: "Perpustakaan",
    description: "Teras outdoor perpustakaan pusat yang menghadap ke pegunungan hijau yang asri. Area belajar santai terbaik dengan pemandangan alam spektakuler.",
    panoramaUrl: "https://pannellum.org/images/jura.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80",
    defaultYaw: 1.5,
    defaultPitch: -0.1,
    mapPosition: { x: 30, y: 40 },
    facilities: ["Outdoor Study Hub", "Green Cafe", "Stop Kontak Outdoor", "Teleskop Pengamatan"],
    navigationHotspots: [
      {
        id: "nav-perpustakaan-to-lobby",
        targetNodeId: "lobby-utama",
        label: "Kembali ke Lobby Utama",
        yaw: -1.2,
        pitch: 0,
      },
      {
        id: "nav-perpustakaan-to-observatorium",
        targetNodeId: "observatorium",
        label: "Naik ke Observatorium Bintang",
        yaw: 0.8,
        pitch: 0.1,
      }
    ],
    infoHotspots: [
      {
        id: "info-perpus-alam",
        label: "Kawasan Hutan Lindung Kampus",
        description: "Area hijau seluas 10 hektar yang dijaga keasriannya sebagai paru-paru kampus dan laboratorium alam biologi.",
        yaw: 2.5,
        pitch: -0.1,
      },
      {
        id: "info-perpus-outdoor-desk",
        label: "Zona Belajar Tenang",
        description: "Dilengkapi dengan peredam suara alami dari pepohonan, sangat cocok untuk membaca buku secara fokus.",
        yaw: 0,
        pitch: -0.2,
      }
    ]
  },
  {
    id: "observatorium",
    name: "Observatorium Bintang & Langit Malam",
    category: "Laboratorium",
    description: "Stasiun observasi astronomi kampus yang terletak di titik tertinggi. Menyediakan pemandangan langit malam tanpa polusi cahaya untuk penelitian astrofisika.",
    panoramaUrl: "https://pannellum.org/images/milky-way.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80",
    defaultYaw: 0,
    defaultPitch: 0,
    mapPosition: { x: 60, y: 25 },
    facilities: ["Kubah Teleskop Refraktor 16 inci", "Lab Analisis Data Kosmik", "Auditorium Kuliah Umum Astronomi", "Ruang Kontrol Cuaca"],
    navigationHotspots: [
      {
        id: "nav-observatorium-to-perpustakaan",
        targetNodeId: "perpustakaan",
        label: "Turun ke Deck Perpustakaan",
        yaw: -1.8,
        pitch: -0.05,
      },
      {
        id: "nav-observatorium-to-lapangan",
        targetNodeId: "lapangan-utama",
        label: "Jalan ke Science Dome Plaza",
        yaw: 1.5,
        pitch: -0.1,
      }
    ],
    infoHotspots: [
      {
        id: "info-obs-milkyway",
        label: "Galaksi Bima Sakti",
        description: "Bintang-bintang dan debu kosmik Bima Sakti yang tertangkap jelas melalui sensor kamera canggih observatorium pada malam bebas awan.",
        yaw: 0.5,
        pitch: 0.3,
      },
      {
        id: "info-obs-telescope",
        label: "Pusat Kontrol Teleskop Utama",
        description: "Teleskop dikendalikan secara otomatis menggunakan koordinat celestial terkomputerisasi melalui sistem biologis khusus.",
        yaw: 2.8,
        pitch: -0.15,
      }
    ]
  },
  {
    id: "lapangan-utama",
    name: "Science Dome Plaza & ALMA",
    category: "Fasilitas Umum",
    description: "Plaza pusat sains yang dikelilingi oleh antena pemancar riset frekuensi radio tinggi (ALMA). Pusat riset teknologi modern dan rekayasa terapan.",
    panoramaUrl: "https://pannellum.org/images/alma.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=400&q=80",
    defaultYaw: 3.1,
    defaultPitch: 0,
    mapPosition: { x: 75, y: 60 },
    facilities: ["Larik Antena Parabola Riset", "Amfiteater Terbuka", "Lab Robotika & Sensor", "Stasiun Pengamatan Cuaca Mikro"],
    navigationHotspots: [
      {
        id: "nav-lapangan-to-gerbang",
        targetNodeId: "gerbang-kampus",
        label: "Kembali ke Gerbang Utama",
        yaw: 0.1,
        pitch: -0.02,
      },
      {
        id: "nav-lapangan-to-observatorium",
        targetNodeId: "observatorium",
        label: "Pergi ke Observatorium Bintang",
        yaw: -2.3,
        pitch: 0.08,
      }
    ],
    infoHotspots: [
      {
        id: "info-lapangan-antena",
        label: "Larik Antena Parabola ALMA",
        description: "Bagian dari fasilitas riset radio astronomi universitas yang berkolaborasi dengan lembaga riset antariksa internasional.",
        yaw: 1.2,
        pitch: 0.2,
      },
      {
        id: "info-lapangan-amfi",
        label: "Amfiteater Mahasiswa",
        description: "Tempat pertunjukan seni terbuka, konser musik kampus, wisuda outdoor, serta demonstrasi robotika tingkat nasional.",
        yaw: -0.5,
        pitch: -0.1,
      }
    ]
  }
];

export const campusInfo = {
  name: "Universitas Antigravity Nusantara (UAN)",
  slogan: "Innovation, Exploration, & Biological Intelligence",
  description: "Universitas riset kelas dunia yang memadukan teknologi kecerdasan buatan, sains antariksa, seni kreatif, dan keselarasan dengan alam. Kampus kami dirancang untuk menginspirasi eksplorasi tanpa batas.",
  stats: [
    { label: "Mahasiswa Aktif", value: "18,500+" },
    { label: "Program Studi", value: "42" },
    { label: "Fasilitas Lab Modern", value: "28" },
    { label: "Peringkat Nasional", value: "Top 5" }
  ],
  quickTips: [
    { title: "Gunakan Mouse / Sentuhan", text: "Klik dan seret (drag) pada layar untuk memutar panorama 360 derajat ke segala arah." },
    { title: "Temukan Hotspot Panah", text: "Arahkan kursor ke ikon panah berkedip dan klik untuk langsung 'berjalan' ke lokasi berikutnya." },
    { title: "Ikon Informasi", text: "Klik ikon lingkaran dengan huruf 'i' untuk menampilkan penjelasan mendalam mengenai fasilitas di titik tersebut." },
    { title: "Buka Sidebar & Peta", text: "Gunakan panel daftar lokasi dan mini-map di kanan bawah untuk berpindah antar titik dengan instan." }
  ]
};
