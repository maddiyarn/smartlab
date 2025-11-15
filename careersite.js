import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Briefcase, TrendingUp, Settings, LogOut, Mail, Lock, Check, Download, BarChart3, Users, Calendar, Plus, Edit, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';

const getTranslations = (lang) => {
  const translations = {
    ru: { appName: 'CareerGate AI', login: 'Вход', register: 'Регистрация', email: 'Email', password: 'Пароль', verify: 'Подтвердить', logout: 'Выход', dashboard: 'Главная', career: 'Профориентация', universities: 'Университеты', trends: 'Тренды', admin: 'Админ', startTest: 'Пройти тест', welcomeMsg: 'Добро пожаловать!', selectQuestions: 'Выберите вопросы', questions: 'вопросов', question: 'Вопрос', of: 'из', news: 'Новости', addNews: 'Добавить', save: 'Сохранить', cancel: 'Отмена', viewDetails: 'Подробнее', topWorldwide: 'Топ-100 мира', topCIS: 'Топ СНГ', topCentralAsia: 'Топ Азия' },
    kk: { appName: 'CareerGate AI', login: 'Кіру', register: 'Тіркелу', email: 'Email', password: 'Құпия сөз', verify: 'Растау', logout: 'Шығу', dashboard: 'Басты', career: 'Мансап', universities: 'Университет', trends: 'Тренд', admin: 'Әкімші', startTest: 'Тест', welcomeMsg: 'Қош келдіңіз!', selectQuestions: 'Сұрақтар', questions: 'сұрақ', question: 'Сұрақ', of: '/', news: 'Жаңалық', addNews: 'Қосу', save: 'Сақтау', cancel: 'Болдырмау', viewDetails: 'Толық', topWorldwide: 'Топ-100', topCIS: 'Топ ТМД', topCentralAsia: 'Топ Азия' },
    en: { appName: 'CareerGate AI', login: 'Login', register: 'Register', email: 'Email', password: 'Password', verify: 'Verify', logout: 'Logout', dashboard: 'Dashboard', career: 'Career', universities: 'Universities', trends: 'Trends', admin: 'Admin', startTest: 'Start Test', welcomeMsg: 'Welcome!', selectQuestions: 'Select questions', questions: 'questions', question: 'Question', of: 'of', news: 'News', addNews: 'Add News', save: 'Save', cancel: 'Cancel', viewDetails: 'Details', topWorldwide: 'Top-100', topCIS: 'Top CIS', topCentralAsia: 'Top Asia' }
  };
  return translations[lang] || translations.en;
};

const universities = [
  { id: 1, name: 'MIT', category: 'worldwide', overall: 95.2, teaching: 93.1, research: 96.4, minScore: 95, location: 'Cambridge, MA' },
  { id: 2, name: 'Stanford', category: 'worldwide', overall: 94.8, teaching: 92.8, research: 95.9, minScore: 94, location: 'Stanford, CA' },
  { id: 3, name: 'Harvard', category: 'worldwide', overall: 94.5, teaching: 94.2, research: 95.1, minScore: 95, location: 'Cambridge, MA' },
  { id: 4, name: 'Oxford', category: 'worldwide', overall: 93.9, teaching: 91.5, research: 94.7, minScore: 93, location: 'Oxford, UK' },
  { id: 5, name: 'Cambridge', category: 'worldwide', overall: 93.6, teaching: 91.2, research: 94.3, minScore: 93, location: 'Cambridge, UK' },
  { id: 11, name: 'МГУ', category: 'cis', overall: 78.4, teaching: 81.2, research: 76.8, minScore: 85, location: 'Москва' },
  { id: 14, name: 'Назарбаев Университет', category: 'cis', overall: 65.3, teaching: 68.7, research: 63.2, minScore: 75, location: 'Астана' },
  { id: 16, name: 'Назарбаев Университет', category: 'centralasia', overall: 65.3, teaching: 68.7, research: 63.2, minScore: 75, location: 'Астана' },
];

const questions = [
  { q: 'Работа с людьми или данными?', o: ['Люди', 'Данные', 'Оба'] },
  { q: 'Структура или креатив?', o: ['Структура', 'Креатив', 'Оба'] },
  { q: 'Офис или удаленно?', o: ['Офис', 'Удаленно', 'Гибрид'] },
  { q: 'Любите решать сложные задачи?', o: ['Да', 'Иногда', 'Нет'] },
  { q: 'Важна командная работа?', o: ['Очень', 'Важна', 'Не очень'] },
  { q: 'Интересны технологии?', o: ['Очень', 'Средне', 'Мало'] },
  { q: 'Готовы к переездам?', o: ['Да', 'Иногда', 'Нет'] },
  { q: 'Стабильность или риск?', o: ['Стабильность', 'Риск', 'Баланс'] },
  { q: 'Публичные выступления?', o: ['Люблю', 'Нормально', 'Не люблю'] },
  { q: 'Важен карьерный рост?', o: ['Очень', 'Важен', 'Не очень'] },
  { q: 'Создавать новое или улучшать?', o: ['Создавать', 'Улучшать', 'Оба'] },
  { q: 'Важна высокая зарплата?', o: ['Очень', 'Важна', 'Не очень'] },
  { q: 'Готовы учиться постоянно?', o: ['Да', 'Периодически', 'Нет'] },
  { q: 'Монотонная работа?', o: ['Нормально', 'Терпимо', 'Не выношу'] },
  { q: 'Цифры или слова?', o: ['Цифры', 'Слова', 'Оба'] },
  { q: 'Важна креативная свобода?', o: ['Очень', 'Важна', 'Не важна'] },
  { q: 'Работа под давлением?', o: ['Мотивирует', 'Нормально', 'Стресс'] },
  { q: 'Короткие или долгие проекты?', o: ['Короткие', 'Долгие', 'Оба'] },
  { q: 'Важен work-life balance?', o: ['Очень', 'Важен', 'Не приоритет'] },
  { q: 'Управлять людьми?', o: ['Да', 'Возможно', 'Нет'] },
  { q: 'Рутинные задачи?', o: ['Нормально', 'Терпимо', 'Избегаю'] },
  { q: 'Код или дизайн?', o: ['Код', 'Дизайн', 'Оба'] },
  { q: 'Социальная значимость?', o: ['Очень важна', 'Важна', 'Не важна'] },
  { q: 'Ненормированный график?', o: ['Да', 'Иногда', 'Нет'] },
  { q: 'Анализ или действие?', o: ['Анализ', 'Действие', 'Оба'] },
  { q: 'Работа с клиентами?', o: ['Люблю', 'Нормально', 'Не люблю'] },
  { q: 'Важна известность?', o: ['Очень', 'Важна', 'Не важна'] },
  { q: 'Физическая или умственная?', o: ['Физическая', 'Умственная', 'Оба'] },
  { q: 'Многозадачность?', o: ['Отлично', 'Нормально', 'Сложно'] },
  { q: 'Международная карьера?', o: ['Очень важна', 'Важна', 'Не важна'] },
  { q: 'Возраст коллег?', o: ['Любой', 'Взрослые', 'Молодежь'] },
  { q: 'Предпринимательство?', o: ['Интересно', 'Возможно', 'Нет'] },
  { q: 'Экологичность компании?', o: ['Очень важна', 'Важна', 'Не важна'] },
  { q: 'Размер компании?', o: ['Крупная', 'Малая', 'Неважно'] },
  { q: 'Иностранные языки?', o: ['Люблю', 'Нормально', 'Сложно'] },
  { q: 'Гибкость в работе?', o: ['Очень важна', 'Важна', 'Не важна'] },
  { q: 'Один или несколько проектов?', o: ['Один', 'Несколько', 'Оба'] },
  { q: 'Конкуренция?', o: ['Мотивирует', 'Нормально', 'Не люблю'] },
  { q: 'Автономность?', o: ['Очень важна', 'Важна', 'Не важна'] },
  { q: 'Работа в стартапе?', o: ['Да', 'Возможно', 'Нет'] }
];

const generateCareers = () => {
  const cats = {
    tech: ['Data Scientist', 'Software Engineer', 'DevOps Engineer', 'AI Engineer', 'Full Stack Dev', 'Backend Dev', 'Frontend Dev', 'Mobile Dev', 'Cloud Architect', 'Cybersecurity'],
    business: ['Product Manager', 'Project Manager', 'Business Analyst', 'Marketing Manager', 'Sales Manager', 'HR Manager', 'Financial Analyst', 'Consultant', 'Operations Manager', 'Brand Manager'],
    design: ['UX/UI Designer', 'Graphic Designer', 'Motion Designer', '3D Artist', 'Industrial Designer', 'Interior Designer', 'Fashion Designer', 'Web Designer', 'Brand Designer', 'Art Director'],
    health: ['Doctor', 'Surgeon', 'Nurse', 'Pharmacist', 'Dentist', 'Psychologist', 'Psychiatrist', 'Physical Therapist', 'Radiologist', 'Cardiologist'],
    edu: ['Teacher', 'Professor', 'Principal', 'Curriculum Developer', 'Education Consultant', 'School Counselor', 'Special Ed Teacher', 'ESL Teacher', 'Librarian', 'Academic Dean'],
    eng: ['Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Chemical Engineer', 'Aerospace Engineer', 'Industrial Engineer', 'Environmental Engineer', 'Petroleum Engineer', 'Mining Engineer', 'Materials Engineer'],
    sci: ['Physicist', 'Chemist', 'Biologist', 'Biochemist', 'Microbiologist', 'Geneticist', 'Neuroscientist', 'Astronomer', 'Geologist', 'Meteorologist'],
    media: ['Journalist', 'Editor', 'Content Writer', 'Technical Writer', 'Social Media Manager', 'Public Relations', 'Communications Director', 'Broadcast Journalist', 'News Anchor', 'Producer'],
    law: ['Lawyer', 'Corporate Lawyer', 'Criminal Lawyer', 'IP Lawyer', 'Tax Lawyer', 'Immigration Lawyer', 'Family Lawyer', 'Real Estate Lawyer', 'Environmental Lawyer', 'Judge']
  };
  
  const careers = [];
  Object.values(cats).forEach(cat => {
    cat.forEach(name => {
      const match = Math.floor(Math.random() * 25) + 65;
      careers.push({
        name,
        match,
        alternatives: [
          { name: name + ' Jr', percent: match - 3 },
          { name: name + ' Sr', percent: match - 6 }
        ],
        universities: [
          { name: 'MIT', requirements: 'GPA 3.8+', subjects: ['CS', 'Math'] },
          { name: 'Stanford', requirements: 'GPA 3.8+', subjects: ['Eng', 'Sci'] }
        ]
      });
    });
  });
  return careers;
};

export default function CareerGateAI() {
  const [lang, setLang] = useState('ru');
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [selectedUni, setSelectedUni] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState({ count: 0, started: false, current: 0 });
  const [aiResponse, setAiResponse] = useState(null);
  const [news, setNews] = useState([{ id: 1, title: 'Открыт набор 2025-2026', content: 'Начался прием заявок', date: '2025-11-10' }]);
  const [newsForm, setNewsForm] = useState({ show: false, id: null, title: '', content: '' });
  const [stats, setStats] = useState({ totalUsers: 0, totalTests: 0, avgScore: 0, popularCareers: {}, usersByRegion: { 'Almaty': 45, 'Astana': 30, 'Shymkent': 15, 'Other': 10 }, requestsByTime: [12, 18, 25, 30, 35, 40, 38, 32, 28, 22, 15, 10] });
  const [admins, setAdmins] = useState([{ id: 1, email: 'nauruzbekov.mail@inbox.ru', role: 'Admin', active: true }]);
  const [adminForm, setAdminForm] = useState({ show: false, email: '', password: '', role: 'Admin' });
  const [showHeatmap, setShowHeatmap] = useState(false);

  const t = getTranslations(lang);

  const handleLogin = () => {
    if (email === 'nauruzbekov.mail@inbox.ru' && password === 'CareerGATE1!') {
      setIsAuth(true);
      setIsAdmin(true);
      setView('dashboard');
    } else if (email && password) {
      setIsAuth(true);
      setView('dashboard');
    }
  };

  const startQuiz = (count) => setQuiz({ count, started: true, current: 0 });

  const answerQuestion = () => {
    if (quiz.current < quiz.count - 1) {
      setQuiz({ ...quiz, current: quiz.current + 1 });
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      const allCareers = generateCareers();
      const num = Math.floor(Math.random() * 5) + 8;
      const selected = allCareers.sort(() => 0.5 - Math.random()).slice(0, num);
      setAiResponse({ careers: selected });
      setStats(prev => {
        const newPop = {...prev.popularCareers};
        selected.forEach(c => { newPop[c.name] = (newPop[c.name] || 0) + 1; });
        return { ...prev, totalTests: prev.totalTests + 1, avgScore: ((prev.avgScore * prev.totalTests + 80) / (prev.totalTests + 1)), popularCareers: newPop };
      });
      setQuiz({ count: 0, started: false, current: 0 });
      setLoading(false);
      setView('dashboard');
    }, 2000);
  };

  const exportCSV = (type) => {
    let csv = '';
    if (type === 'users') csv = 'ID,Email,Tests\n1,user@ex.com,' + stats.totalTests;
    else if (type === 'analytics') csv = 'Metric,Value\nUsers,' + stats.totalUsers + '\nTests,' + stats.totalTests;
    else if (type === 'careers') {
      csv = 'Career,Requests\n';
      Object.entries(stats.popularCareers).forEach(([c, n]) => { csv += c + ',' + n + '\n'; });
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type + '_export.csv';
    a.click();
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4 flex gap-2">
          {['ru', 'kk', 'en'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded text-sm ${lang === l ? 'bg-indigo-600 text-white' : 'bg-white'}`}>{l.toUpperCase()}</button>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <GraduationCap className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">{t.appName}</h1>
          </div>
          {view === 'verify' ? (
            <div className="space-y-4">
              <input type="text" placeholder={t.verify} value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-4 py-3 border rounded-lg" maxLength={6} />
              <button onClick={() => { if (code === '123456') { setIsAuth(true); setView('dashboard'); } }} className="w-full bg-indigo-600 text-white py-3 rounded-lg">{t.verify}</button>
            </div>
          ) : view === 'register' ? (
            <div className="space-y-4">
              <input type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
              <input type="password" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
              <button onClick={() => { if (email && password) setView('verify'); }} className="w-full bg-indigo-600 text-white py-3 rounded-lg">{t.register}</button>
              <button onClick={() => setView('login')} className="w-full text-indigo-600 text-sm">Login</button>
            </div>
          ) : (
            <div className="space-y-4">
              <input type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
              <input type="password" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
              <button onClick={handleLogin} className="w-full bg-indigo-600 text-white py-3 rounded-lg">{t.login}</button>
              <button onClick={() => setView('register')} className="w-full text-indigo-600 text-sm">Register</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold">{t.appName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {['ru', 'kk', 'en'].map(l => (
                <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded text-xs ${lang === l ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={() => { setIsAuth(false); setView('login'); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
              <LogOut className="w-4 h-4" />{t.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex gap-2 mb-8">
          {[
            { id: 'dashboard', icon: User, label: t.dashboard },
            { id: 'career', icon: Briefcase, label: t.career },
            { id: 'universities', icon: GraduationCap, label: t.universities },
            { id: 'trends', icon: TrendingUp, label: t.trends },
            ...(isAdmin ? [{ id: 'admin', icon: Settings, label: t.admin }] : [])
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${view === item.id ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </button>
          ))}
        </nav>

        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">{t.welcomeMsg}</h2>
              <button onClick={() => setView('career')} className="mt-4 bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium">{t.startTest}</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">{t.news}</h3>
              {news.map(item => (
                <div key={item.id} className="border rounded-lg p-4 mb-3">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.date}</p>
                  <p className="text-gray-700 mt-2">{item.content}</p>
                </div>
              ))}
            </div>
            {aiResponse && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Рекомендации</h3>
                {aiResponse.careers.map((c, i) => (
                  <div key={i} className="border rounded-lg p-4 mb-3">
                    <div className="flex justify-between mb-2">
                      <h4 className="text-lg font-semibold">{c.name}</h4>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{c.match}%</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {c.alternatives.map((a, j) => <span key={j}>{a.name} ({a.percent}%) </span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'career' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            {!quiz.started ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t.selectQuestions}</h2>
                <div className="grid grid-cols-4 gap-4">
                  {[10, 20, 30, 40].map(n => (
                    <button key={n} onClick={() => startQuiz(n)} className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
                      <p className="text-4xl font-bold text-indigo-600">{n}</p>
                      <p>{t.questions}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-sm">{t.question} {quiz.current + 1} {t.of} {quiz.count}</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: ((quiz.current + 1) / quiz.count * 100) + '%' }} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-6">{questions[quiz.current % questions.length].q}</h3>
                <div className="space-y-3">
                  {questions[quiz.current % questions.length].o.map((opt, i) => (
                    <button key={i} onClick={answerQuestion} className="w-full text-left p-4 border-2 rounded-lg hover:border-indigo-500">{opt}</button>
                  ))}
                </div>
                {loading && <div className="mt-6 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}
              </div>
            )}
          </div>
        )}

        {view === 'universities' && (
          <div className="space-y-6">
            {['worldwide', 'cis', 'centralasia'].map(cat => (
              <div key={cat} className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">{t['top' + cat.charAt(0).toUpperCase() + cat.slice(1)] || cat}</h3>
                {universities.filter(u => u.category === cat).map(uni => (
                  <div key={uni.id} className="border rounded-lg p-4 mb-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold">{uni.name}</h4>
                        <p className="text-sm text-gray-600">{uni.location}</p>
                      </div>
                      <button onClick={() => setSelectedUni(uni)} className="text-indigo-600 text-sm">{t.viewDetails}</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {selectedUni && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-2xl w-full p-8">
                  <div className="flex justify-between mb-6">
                    <h3 className="text-2xl font-bold">{selectedUni.name}</h3>
                    <button onClick={() => setSelectedUni(null)}><X className="w-6 h-6" /></button>
                  </div>
                  <p>Overall: {selectedUni.overall}</p>
                  <p>Min Score: {selectedUni.minScore}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'admin' && isAdmin && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Users', value: stats.totalUsers },
                { label: 'Tests', value: stats.totalTests },
                { label: 'Avg Score', value: stats.avgScore.toFixed(1) + '%' },
                { label: 'Careers', value: Object.keys(stats.popularCareers).length }
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <p className="text-sm text-gray-600">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-bold">Heatmap по регионам</h3>
                <button onClick={() => setShowHeatmap(!showHeatmap)} className="text-indigo-600 text-sm">{showHeatmap ? 'Скрыть' : 'Показать'}</button>
              </div>
              {showHeatmap && (
                <div className="space-y-3">
                  {Object.entries(stats.usersByRegion).map(([region, count]) => (
                    <div key={region} className="flex items-center gap-3">
                      <span className="w-24 text-sm">{region}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div className="bg-indigo-600 h-4 rounded-full" style={{ width: count + '%' }}></div>
                      </div>
                      <span className="text-sm">{count}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Запросы по времени</h3>
              <div className="flex items-end gap-2 h-32">
                {stats.requestsByTime.map((cnt, i) => (
                  <div key={i} className="flex-1 bg-indigo-200 rounded-t" style={{ height: (cnt/40*100) + '%' }}></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Экспорт данных</h3>
              <div className="grid grid-cols-3 gap-4">
                {['users', 'analytics', 'careers'].map(type => (
                  <button key={type} onClick={() => exportCSV(type)} className="bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />{type}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-bold">Администраторы</h3>
                <button onClick={() => setAdminForm({ show: true, email: '', password: '', role: 'Admin' })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />Добавить
                </button>
              </div>
              {admins.map(admin => (
                <div key={admin.id} className="flex justify-between items-center p-4 border rounded-lg mb-2">
                  <div>
                    <p className="font-medium">{admin.email}</p>
                    <p className="text-sm text-gray-600">{admin.role}</p>
                  </div>
                  {admin.id !== 1 && (
                    <button onClick={() => setAdmins(admins.filter(a => a.id !== admin.id))} className="text-red-600 text-sm">Удалить</button>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Популярные профессии</h3>
              {Object.entries(stats.popularCareers).length > 0 ? Object.entries(stats.popularCareers).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([career, count], i) => (
                <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2">
                  <span>{career}</span>
                  <span className="text-sm text-gray-600">{count} запросов</span>
                </div>
              )) : <p className="text-gray-500 text-center">Нет данных</p>}
            </div>
          </div>
        )}
      </div>

      {adminForm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold mb-6">Добавить администратора</h3>
            <div className="space-y-4">
              <input type="email" placeholder="Email" value={adminForm.email} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input type="password" placeholder="Пароль" value={adminForm.password} onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <select value={adminForm.role} onChange={(e) => setAdminForm({...adminForm, role: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
                <option value="Admin">Admin</option>
                <option value="Analyst">Analyst</option>
              </select>
              <div className="flex gap-3">
                <button onClick={() => { if (adminForm.email && adminForm.password) { setAdmins([...admins, { id: Date.now(), email: adminForm.email, role: adminForm.role, active: true }]); setAdminForm({ show: false, email: '', password: '', role: 'Admin' }); } }} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg">Добавить</button>
                <button onClick={() => setAdminForm({ show: false, email: '', password: '', role: 'Admin' })} className="flex-1 bg-gray-200 py-3 rounded-lg">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
