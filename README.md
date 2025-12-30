# SpendWise — Smart Money Management

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-Build-orange)
![License](https://img.shields.io/badge/License-MIT-green)

SpendWise is a modern expense-tracking app designed to help users organize spending, visualize patterns, and manage daily finances more intentionally.

This project demonstrates my skills across frontend engineering, authentication, state management, database design, and UI polish.

---

## 🌐 Live Demo

👉 Deployed on Vercel:   
🔗 https://spend-wise-tawny-sigma.vercel.app/

---

## 📸 Preview
<img width="909" height="793" alt="Expense_Tracker" src="https://github.com/user-attachments/assets/e70f2a51-b79d-43b2-b5cb-08ac4ab7e4ca" />


---

## ✨ Features

- Add, edit, and delete expenses
- Category-based tracking
- Search and sort filters
- Week / Month views
- Spending visualization (Chart.js)
- Secure authentication (Supabase Auth)
- Per-user data isolation with RLS
- Dark mode UI
- Bulk delete (month / all — with confirmations)

---

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Framer Motion
- Chart.js

**Backend**
- Supabase (Auth + Database)
- Row Level Security rules for user-specific data

**Deployment**
- Vercel

---

## 📂 Project Structure (high-level)
```
src/
├── components/
│   ├── auth/
│   ├── expenses/
│   └── layout/
├── constants/
├── lib/
├── App.jsx
└── main.jsx
```

---

## 💡 Key Learning Focus

- Building reusable UI components
- Implementing secure authentication
- Managing application-level state
- Handling protected user data with RLS
- Creating intuitive financial dashboards
- UX decisions: confirmations, feedback, error states
- Deploying and environment setup for production

---

## ▶️ Local Setup

```
npm install
npm run dev
```

Create .env.local:

```
VITE_SUPABASE_URL=YOUR_URL
VITE_SUPABASE_ANON_KEY=YOUR_KEY
```

---

## 📄 License

MIT — free for personal and commercial use.

---

## 🚀 Next Enhancements
•	Recurring expenses
•	Monthly budgets + alerts
•	CSV export
•	Mobile-first UI refinements

---

## 💬 Suggestions & Feedback

If you have ideas for improvements, feature requests, or notice any issues,
feel free to open:

- an **Issue** (bugs / suggestions)
- a **Pull Request** (contributions welcome)

I’m continuously improving SpendWise and would love to hear your thoughts.

---

## 👤 Author

**Jayraj Sawant**
