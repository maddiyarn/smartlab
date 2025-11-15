EduCareerHub
A unified web application combining student portfolio management, career guidance, and AI-driven recommendations. It supports user roles, GPA imports, quizzes, university/trend searches, events, and admin tools.
Features

Authentication: Login/register with role-based access (student, admin, teacher).
Dashboard: GPA stats, AI recommendations, news feed.
Career Test: Interactive quiz for profession recommendations with AI.
Universities & Trends: Searchable lists of universities and job trends.
Events & Portfolio: Event registration, achievement tracking.
Admin Panel: User management, role updates, news CRUD, statistics.
Multi-language: RU/KK/EN support.
Modals & UI: Responsive design with imports, registrations, and details views.

Tech Stack

Frontend

Clone repo: git clone <repo-url>.
Navigate: cd frontend.
Install: npm install.
Run: npm start (localhost:3000).

Backend

Navigate: cd backend.
Install: npm install.
Set ENV: Create .env with DB_URI, JWT_SECRET, OPENAI_API_KEY.
Run: npm start (localhost:5000).

Usage

Login with test accounts: admin@akt.nis.edu.kz (admin), student@akt.nis.edu.kz (student).
Navigate tabs based on role.
Import GPA via modal.
Take career quiz for AI suggestions.
Admin: Manage users/news/stats.

Architecture

Frontend: SPA with conditional rendering. Components: Header/Navigation/Pages/Modals. State in App.jsx.
Backend: REST routes (/auth, /users, etc.). Controllers for CRUD/auth. Mock-to-real API transition.

Contributing
Fork, create branch, PR. Issues welcome.

License

MIT License.
