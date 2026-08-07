# English Access Hub

# IEA — IELTS & English Access | Lovable uchun to'liq loyiha prompti

## Umumiy g'oya
"IEA (IELTS & English Access)" nomli veb-platforma yasa. Bu platforma foydalanuvchilarga ingliz tilini noldan o'rganish yoki mavjud darajasini oshirishga yordam beradi. Loyiha **Vite + React + TypeScript** asosida, **faqat frontend** (backend kerak emas), ma'lumotlar bazasi sifatida **Firebase (Firestore + Authentication)** ishlatiladi, alohida `firebaseConfig.ts` fayl orqali sozlansin.

## Dizayn yo'nalishi (stil manbai)
Men tashlagan landing page skrinshotidagi stilni asos qilib ol:
- Fon: oq / juda ochiq ko'k-kulrang (#F8FAFC)
- Asosiy rang: to'q ko'k-siyoh (#1E3A8A) va yorqin ko'k (#2563EB) gradient
- Tugmalar: to'liq yumaloq (pill-shape), gradient fon, oq matn
- Logo: qalpoqcha (graduation cap) ikonasi + "IEA" qalin qora harflarda, pastida "IELTS & ENGLISH ACCESS" va kichik kursiv slogan "Learning Today, Leading Tomorrow"
- Shrift: zamonaviy sans-serif (Inter yoki shunga o'xshash), sarlavhalar bold/extra-bold
- Kartalar: yumshoq soya (shadow), yumaloq burchaklar (rounded-2xl)
- Umumiy uslub: toza, minimal, professional ta'lim platformasi ko'rinishi (soft SaaS look)

---

## 1-BO'LIM: Landing Page

Quyidagi bo'limlardan iborat (navbar: Home, About, Courses, Teachers, Testimonials, Contact + "Join Now" tugmasi):

- **Hero section**: "Free IELTS & English Access" sarlavhasi, qisqa tavsif, "Join Now" va "Explore Courses" tugmalari, o'ng tomonda IEA logo kartasi + "Trusted by 3000+ learners" badge
- **About**: platforma haqida qisqa ma'lumot
- **Courses**: taklif qilinadigan yo'nalishlar (IELTS Speaking, Listening, Reading, Writing va umumiy English)
- **Teachers**: o'qituvchilar bo'limi (kartochkalar)
- **Testimonials**: foydalanuvchilar fikri
- **Contact**: aloqa formasi/ma'lumotlari
- **Footer**

**MUHIM**: "Join Now" tugmasi bosilganda foydalanuvchi to'g'ridan-to'g'ri **ro'yxatdan o'tish** sahifasiga emas, balki **darajani aniqlash testiga (placement test)** yo'naltirilishi kerak.

---

## 2-BO'LIM: Placement Test (Darajani aniqlash testi)

- 20 ta savoldan iborat ingliz tili bilim darajasini aniqlovchi test (multiple choice, har savolda 4 ta variant)
- Test tugagach, to'g'ri javoblar soniga qarab avtomatik daraja belgilanadi, masalan:
  - 0–5 to'g'ri → Beginner
  - 6–10 to'g'ri → Elementary
  - 11–14 to'g'ri → Intermediate
  - 15–17 to'g'ri → Upper-Intermediate
  - 18–20 to'g'ri → Advanced
- Test natijasi ko'rsatiladi ("Sizning darajangiz: Intermediate") va shundan keyin foydalanuvchi **Register (ro'yxatdan o'tish)** sahifasiga yo'naltiriladi
- Aniqlangan daraja avtomatik ravishda ro'yxatdan o'tish ma'lumotlariga biriktiriladi (keyinchalik Firestore'dagi user profiliga yoziladi)

---

## 3-BO'LIM: Register / Login

- Oddiy forma: Ism-familiya, Email, Parol (Firebase Authentication — Email/Password)
- Ro'yxatdan o'tishda foydalanuvchi hujjatiga (Firestore `users` collection) quyidagilar yoziladi: `name`, `email`, `level` (test natijasidan), `createdAt`, `videosWatched: []`, `mockResults: []`
- Login sahifasi ham bo'lsin (qayta kirish uchun)
- **Maxsus admin login**: agar login formasida email sifatida `diyorbekmuzaffarovich4@gmail.com` va parol `admin123` kiritilsa — foydalanuvchi oddiy dashboard'ga emas, **Admin Panelga** yo'naltirilsin. Bu tekshiruv frontend darajasida (login funksiyasi ichida) amalga oshsin.

---

## 4-BO'LIM: Asosiy foydalanuvchi paneli (Student Dashboard)

Ro'yxatdan o'tgandan keyin foydalanuvchi kiradigan asosiy hudud, ichida bir nechta sahifa/tab bo'lsin (sidebar yoki tab navigatsiya):

### 4.1. Videolar sahifasi (Home / Videos)
- Admin tomonidan yuklab qo'yilgan video darslar ro'yxati (YouTube link yoki video URL asosida) shu yerda chiqib turadi
- Har video: sarlavha, tavsif, thumbnail, "Watched" belgisi
- Foydalanuvchi videoni ko'rgach "watched" deb belgilanadi (Firestore'da userning `videosWatched` massiviga video ID qo'shiladi)

### 4.2. O'yinlar sahifasi (Games)
- Ingliz tilini o'rganishga yordam beradigan, qiziqarli va "adrenalinga boy" interaktiv o'yinlar (masalan: so'z topish, vocabulary quiz, timed challenge, hangman-uslubidagi so'z o'yini va h.k.) — kamida 2-3 ta o'yin turi frontend'da to'liq ishlaydigan qilib yasalsin
- **Bonusli mexanika**: agar foydalanuvchi kamida 5 ta videoni ko'rgan bo'lsa, unga avtomatik ravishda **1 ta bepul IELTS darsi** ochiladi (bu ham admin tomonidan joylanadigan alohida kontent bo'lib, faqat shart bajarilgan userlarga ko'rinadi/unlock bo'ladi)

### 4.3. Mock Test sahifasi
- Foydalanuvchi istalgan vaqtda haqiqiy IELTS imtihoniga o'xshash **to'liq mock test** topshirishi mumkin
- 4 ta skill bo'yicha: **Listening, Reading, Writing, Speaking** (Speaking va Writing uchun matn/audio javob yozish maydoni, Listening/Reading uchun multiple-choice yoki qisqa javoblar)
- Test yakunida natija hisoblanadi va Firestore'ga saqlanadi (`mockResults` collection: userId, sana, har skill bo'yicha ball, umumiy band score)
- Barcha natijalar avtomatik **Admin panelga** ham yuboriladi (adminga umumiy jadvalda ko'rinadi)

### 4.4. Leaderboard sahifasi
- Barcha foydalanuvchilar reyting jadvali — mock test natijalari yoki umumiy ball bo'yicha saralangan (yuqoridan pastga)
- Foydalanuvchining ismi, darajasi, umumiy bali, o'rni (rank) ko'rsatilsin
- O'zining joriy o'rni alohida ajratib ko'rsatilsin

---

## 5-BO'LIM: Admin Panel

Faqat `diyorbekmuzaffarovich4@gmail.com` / `admin123` orqali kirish mumkin. Keng funksionallikka ega bo'lsin:

- **Studentlar boshqaruvi**: barcha ro'yxatdan o'tgan foydalanuvchilar jadvali — ism, email, level'ni **edit** qilish, kerak bo'lsa o'chirish
- **Video boshqaruvi**: yangi video qo'shish (sarlavha, tavsif, video URL/link, thumbnail), mavjud videolarni tahrirlash yoki o'chirish
- **Kim qaysi videoni ko'rgani**: har video ostida yoki alohida jadvalda qaysi student qaysi videoni tomosha qilgani ro'yxati
- **Mock test natijalari**: barcha studentlarning barcha mock test natijalari jadval ko'rinishida (filtrlash/saralash imkoniyati bilan)
- **Bepul IELTS dars kontenti**: 5 video ko'rgan userlarga ochiladigan maxsus darsni admin joylashi/tahrirlashi mumkin
- **O'yinlar/savollar boshqaruvi** (agar vaqt bo'lsa): placement test savollarini yoki o'yin so'zlar bazasini tahrirlash imkoniyati
- Admin panel alohida, chiroyli sidebar-based dashboard dizaynida bo'lsin (statistika kartalari: jami studentlar soni, jami videolar, jami mock testlar va h.k. bilan boshlansin)

---

## 6-BO'LIM: Texnik talablar

- **Frontend**: Vite + React + TypeScript
- **Backend yo'q** — hammasi frontend orqali to'g'ridan-to'g'ri Firebase bilan ishlaydi
- **Firebase**: 
  - Authentication (Email/Password)
  - Firestore Database — collectionlar: `users`, `videos`, `mockResults`, `leaderboard` (yoki `users` ichidan hisoblanadi), `games` (agar kerak bo'lsa)
  - Alohida `src/firebaseConfig.ts` fayl yarat, unda Firebase config obyekti bo'lsin (men keyinroq o'z Firebase loyiham ma'lumotlarini qo'yaman)
- **Routing**: React Router — sahifalar: `/` (landing), `/test` (placement test), `/register`, `/login`, `/dashboard` (videos), `/games`, `/mock-test`, `/leaderboard`, `/admin`
- **Protected routes**: `/dashboard`, `/games`, `/mock-test`, `/leaderboard` — faqat login qilgan userlar uchun; `/admin` — faqat admin email uchun
- **Responsive** dizayn — mobil va desktopda ham yaxshi ko'rinsin
- Kodni toza, komponentlarga bo'lingan holda yoz (har sahifa/blok — alohida komponent)

---

## Xulosa
Yuqoridagi barcha bo'limlarni izchil, bir-biriga bog'liq flow sifatida qur: **Landing → Join Now → Placement Test (20 savol) → Register (daraja avtomatik biriktiriladi) → Student Dashboard (Videos / Games / Mock Test / Leaderboard)**, alohida yashirin **Admin Panel** (maxsus login orqali) — to'liq CRUD funksionallik bilan studentlar, videolar va mock natijalarni boshqarish uchun. Dizaynda men bergan skrinshotdagi ko'k-oq, minimal, professional ta'lim platformasi uslubini saqla.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://fluent-path-14.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aede9e46-9dbc-4f66-957e-51e95057b7a5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
