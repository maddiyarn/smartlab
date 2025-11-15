import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Upload, Users, Award, Bell, Home, FileText, Calendar, BarChart3, TrendingUp, Settings, UserPlus, LogOut, Briefcase } from 'lucide-react';

const sushAccounts = {
  '110107504644': { 
    gpa: 4.93, 
    achievements: 12, 
    badges: ['Perfect Score', 'Honor Roll', 'Excellence Award'] 
  },
  '101012501011': { 
    gpa: 4.13, 
    achievements: 7, 
    badges: ['Honor Roll'] 
  },
  '100907654179': { 
    gpa: 5.00, 
    achievements: 11, 
    badges: ['Perfect Score', 'Excellence Award', 'Champion'] 
  }
};

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [allUsers, setAllUsers] = useState([
    { 
      id: '1', 
      email: 'student@akt.nis.edu.kz', 
      firstName: 'Таган', 
      lastName: 'Адлет', 
      role: 'student', 
      gpa: 0, 
      badges: [], 
      points: 1000, 
      achievements: [] 
    },
    { 
      id: '2', 
      email: 'admin@akt.nis.edu.kz', 
      firstName: 'Administrator', 
      lastName: '', 
      role: 'admin', 
      gpa: 0, 
      badges: [], 
      points: 0, 
      achievements: [] 
    }
  ]);
  const [pendingAchievements, setPendingAchievements] = useState([]);

  const handleLogin = (email) => {
    const foundUser = allUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setPage('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    setAllUsers(allUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const updateUserRole = (userId, newRole) => {
    setAllUsers(allUsers.map(u => {
      if (u.id === userId) {
        return Object.assign({}, u, { role: newRole });
      }
      return u;
    }));
  };

  const addPendingAchievement = (achievement) => {
    setPendingAchievements([].concat(pendingAchievements, [achievement]));
  };

  const approvePendingAchievement = (achievementId) => {
    const achievement = pendingAchievements.find(a => a.id === achievementId);
    if (achievement) {
      const updatedUser = allUsers.find(u => u.id === achievement.userId);
      if (updatedUser) {
        const approvedAchievement = Object.assign({}, achievement, { status: 'approved' });
        updatedUser.achievements.push(approvedAchievement);
        setAllUsers([].concat(allUsers));
      }
      setPendingAchievements(pendingAchievements.filter(a => a.id !== achievementId));
    }
  };

  const rejectPendingAchievement = (achievementId) => {
    setPendingAchievements(pendingAchievements.filter(a => a.id !== achievementId));
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      <Navigation user={user} page={page} setPage={setPage} />
      <main className="py-6">
        {page === 'dashboard' && <Dashboard user={user} updateUser={updateUser} />}
        {page === 'events' && <EventsPage user={user} />}
        {page === 'portfolio' && <Portfolio user={user} addPendingAchievement={addPendingAchievement} />}
        {page === 'career' && <CareerGuidance user={user} />}
        {page === 'admin' && (user.role === 'admin' || user.role === 'curator') && (
          <AdminPanel 
            users={allUsers} 
            updateUserRole={updateUserRole} 
            currentUser={user}
            pendingAchievements={pendingAchievements}
            approvePendingAchievement={approvePendingAchievement}
            rejectPendingAchievement={rejectPendingAchievement}
          />
        )}
      </main>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onLogin(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">SmartLab</h1>
          <p className="text-gray-600">Портфолио достижений</p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Используйте @akt.nis.edu.kz</p>
          </div>

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">SmartLab</h1>
          
          <div className="flex items-center gap-4">
            {user.role === 'student' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-2xl" role="img" aria-label="gem">💎</span>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Баллы</span>
                  <span className="font-bold text-lg">{user.points}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <img 
                src="https://via.placeholder.com/40" 
                alt={user.firstName}
                className="w-10 h-10 rounded-full"
              />
              <div className="text-sm">
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-gray-500 text-xs capitalize">{user.role}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Выйти"
            >
              <LogOut size={20} />
              <span className="text-sm">Выйти</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const Navigation = ({ user, page, setPage }) => {
  const getNavItems = () => {
    const common = [
      { id: 'dashboard', icon: Home, label: 'Главная' },
      { id: 'events', icon: Calendar, label: 'Мероприятия' },
      { id: 'career', icon: Briefcase, label: 'Профориентация' }
    ];

    if (user.role === 'student') {
      const studentItems = common.slice();
      studentItems.push({ id: 'portfolio', icon: FileText, label: 'Портфолио' });
      return studentItems;
    }

    if (user.role === 'admin' || user.role === 'curator') {
      const adminItems = common.slice();
      const label = user.role === 'admin' ? 'Админ панель' : 'Панель куратора';
      adminItems.push({ id: 'admin', icon: BarChart3, label: label });
      return adminItems;
    }

    return common;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex items-center gap-2 px-4 py-3 ${
                page === item.id
                  ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Dashboard = ({ user, updateUser }) => {
  const [showSushModal, setShowSushModal] = useState(false);

  const getStatusColor = () => {
    const gpa = user.gpa || 0;
    if (gpa >= 4) return 'bg-green-500';
    if (gpa >= 3) return 'bg-blue-500';
    if (gpa >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRecommendations = () => {
    const gpa = user.gpa || 0;
    
    if (gpa >= 4.0) {
      return {
        status: 'excellent',
        message: 'Отличная работа! Ваш высокий GPA открывает новые возможности.',
        actions: [
          'Участие во внеклассных активностях',
          'Менторство младших учеников',
          'Участие в национальных конкурсах'
        ]
      };
    } else if (gpa >= 3.0) {
      return {
        status: 'good',
        message: 'Хороший прогресс! Давайте расширим ваши горизонты.',
        actions: [
          'Дополнительные уроки по слабым предметам',
          'Активное участие во внеклассных мероприятиях',
          'Развитие лидерских навыков'
        ]
      };
    } else if (gpa >= 2.0) {
      return {
        status: 'needs_improvement',
        message: 'Есть потенциал для роста. Сфокусируемся на улучшении.',
        actions: [
          'Улучшение успеваемости на уроках - приоритет',
          'Активное участие на дополнительных занятиях',
          'Консультации с учителями'
        ]
      };
    } else {
      return {
        status: 'critical',
        message: 'Начните с малого - каждый шаг важен для вашего развития.',
        actions: [
          'Консультация с куратором',
          'Составление плана улучшения',
          'Регулярные занятия'
        ]
      };
    }
  };

  const recommendations = user.role === 'student' ? getRecommendations() : null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Добро пожаловать, {user.firstName}!</h2>
        <p className="text-gray-600">Роль: {user.role === 'student' ? 'Ученик' : user.role === 'admin' ? 'Администратор' : user.role}</p>
      </div>

      {user.role === 'student' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Текущий GPA</span>
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              </div>
              <div className="text-4xl font-bold text-blue-600">{user.gpa.toFixed(2)}</div>
              
              <button
                onClick={() => setShowSushModal(true)}
                className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
              >
                <TrendingUp size={16} />
                <span>Импортировать с Дневника (СУШ)</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <span className="text-gray-600 block mb-2">Достижения</span>
              <div className="text-4xl font-bold text-green-600">{user.achievements ? user.achievements.length : 0}</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <span className="text-gray-600 block mb-2">Награды</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.badges && user.badges.length > 0 ? (
                  user.badges.map((badge, idx) => (
                    <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {badge}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">Нет наград</span>
                )}
              </div>
            </div>
          </div>

        {recommendations && (
          <div className={`rounded-xl shadow-sm p-6 ${
              recommendations.status === 'excellent' ? 'bg-green-50' :
              recommendations.status === 'good' ? 'bg-blue-50' :
              recommendations.status === 'needs_improvement' ? 'bg-yellow-50' :
              'bg-gray-50'
            }`}>
              <h3 className="font-bold text-lg mb-2">
                <span role="img" aria-label="robot">🤖</span> AI Рекомендации
              </h3>
              <p className="text-gray-700 mb-4">{recommendations.message}</p>
              <ul className="space-y-2">
                {recommendations.actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {user.role === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">Панель администратора</h3>
          <p className="text-gray-600 mb-4">Добро пожаловать в административную панель</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600 mt-1">Всего пользователей</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600 mt-1">Достижений</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600 mt-1">Мероприятий</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const SushImportModal = ({ onClose, user, updateUser }) => {
  const [iin, setIin] = useState('');
  const [password, setPassword] = useState('');
  const [importing, setImporting] = useState(false);

  const handleImport = () => {
    if (!iin || !password) {
      alert('Заполните все поля');
      return;
    }

    const sushData = sushAccounts[iin];
    if (!sushData) {
      alert('ИИН не найден в системе СУШ');
      return;
    }

    setImporting(true);
    
    setTimeout(() => {
      const mockAchievements = Array.from({ length: sushData.achievements }, (_, i) => ({
        id: `ach_${Date.now()}_${i}`,
        title: `Достижение ${i + 1}`,
        category: 'competitions',
        status: 'approved',
        date: new Date()
      }));

      const updatedUser = {
        ...user,
        gpa: sushData.gpa,
        badges: sushData.badges,
        achievements: mockAchievements
      };
      updateUser(updatedUser);
      alert(`GPA успешно импортирован: ${sushData.gpa}\nДостижений: ${sushData.achievements}`);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Импорт из СУШ</h3>
        
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
          Примечание: Используйте аккаунт СУШ
        </div>

        {!importing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ИИН</label>
              <input
                type="text"
                value={iin}
                onChange={(e) => setIin(e.target.value)}
                placeholder="Введите ИИН"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Тестовые ИИН: 110107504644, 101012501011, 100907654179</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль СУШ</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleImport}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                Импортировать
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 py-3 rounded-lg hover:bg-gray-200 font-medium"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Импортирование данных из СУШ...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Portfolio = ({ user, addPendingAchievement }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', category: '', description: '', file: null });
  const [validating, setValidating] = useState(false);

  const handleUpload = () => {
    if (!uploadData.title || !uploadData.category || !uploadData.description) {
      alert('Заполните все поля');
      return;
    }

    setValidating(true);

    setTimeout(() => {
      const newAchievement = {
        id: `pending_${Date.now()}`,
        userId: user.id,
        ...uploadData,
        status: 'pending',
        aiValidation: {
          passed: Math.random() > 0.2,
          confidence: Math.floor(Math.random() * 30) + 70
        },
        uploadedAt: new Date()
      };

      addPendingAchievement(newAchievement);
      alert('Достижение отправлено на рассмотрение!\nAI валидация: ' + (newAchievement.aiValidation.passed ? 'Пройдена' : 'Требуется проверка'));
      setValidating(false);
      setShowUpload(false);
      setUploadData({ title: '', category: '', description: '', file: null });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Мое портфолио</h2>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Upload size={18} />
            <span>Загрузить достижение</span>
          </button>
        </div>
        
        {user.achievements && user.achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.achievements.map(ach => (
              <div key={ach.id} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{ach.title}</h3>
                <p className="text-sm text-gray-600">{ach.category}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  Подтверждено
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <p>У вас пока нет достижений</p>
            <p className="text-sm mt-2">Загрузите свои достижения для их отображения здесь</p>
          </div>
        )}
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Загрузить достижение</h3>

            {!validating ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Категория</label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Выберите категорию</option>
                    <option value="competitions">Конкурсы</option>
                    <option value="sports">Спорт</option>
                    <option value="volunteering">Волонтерство</option>
                    <option value="leadership">Лидерство</option>
                    <option value="arts">Искусство</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Файл (документ/фото)</label>
                  <input
                    type="file"
                    onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleUpload}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Загрузить
                  </button>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="flex-1 bg-gray-100 py-3 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">AI валидация документа...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ users, updateUserRole, currentUser, pendingAchievements, approvePendingAchievement, rejectPendingAchievement }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  const handleAssignRole = () => {
    if (selectedUser && newRole) {
      updateUserRole(selectedUser.id, newRole);
      const userName = selectedUser.firstName + ' ' + selectedUser.lastName;
      alert('Роль "' + newRole + '" назначена пользователю ' + userName);
      setSelectedUser(null);
      setNewRole('');
    }
  };

  const roles = [
    { value: 'student', label: 'Ученик' },
    { value: 'teacher', label: 'Учитель' },
    { value: 'curator', label: 'Куратор' },
    { value: 'organizer', label: 'Организатор' },
    { value: 'admin', label: 'Администратор' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{currentUser.role === 'admin' ? 'Управление системой' : 'Панель куратора'}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Пользователи
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              На рассмотрении ({pendingAchievements.length})
            </button>
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Текущая роль</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">GPA</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://via.placeholder.com/32"
                          className="w-8 h-8 rounded-full"
                          alt={u.firstName}
                        />
                        <span className="font-medium">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        u.role === 'admin' ? 'bg-red-100 text-red-800' :
                        u.role === 'teacher' ? 'bg-green-100 text-green-800' :
                        u.role === 'curator' ? 'bg-blue-100 text-blue-800' :
                        u.role === 'organizer' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{u.gpa.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => { setSelectedUser(u); setNewRole(u.role); }}
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        >
                          <UserPlus size={16} />
                          <span>Изменить роль</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingAchievements.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>Нет достижений на рассмотрении</p>
              </div>
            ) : (
              pendingAchievements.map(ach => (
                <div key={ach.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{ach.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Категория: {ach.category}</p>
                      <p className="text-sm text-gray-600">Описание: {ach.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Загружено: {new Date(ach.uploadedAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded text-xs ${
                      ach.aiValidation.passed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      AI: {ach.aiValidation.confidence}%
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => {
                        approvePendingAchievement(ach.id);
                        alert('Достижение подтверждено!');
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Подтвердить
                    </button>
                    <button
                      onClick={() => {
                        rejectPendingAchievement(ach.id);
                        alert('Достижение отклонено');
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Отклонить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Изменить роль пользователя</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Пользователь:</p>
              <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Новая роль</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAssignRole}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Назначить
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-gray-100 py-2 rounded-lg hover:bg-gray-200"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CareerGuidance = ({ user }) => {
  const handleOpenCareerTest = () => {
    window.open('https://claude.ai/public/artifacts/4f3aa03b-c2d1-469e-8ce7-fc4a6c4d649e', '_blank');
  };

  const gpaValue = user.gpa || 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Briefcase size={32} className="text-blue-600" />
          <h2 className="text-2xl font-bold">Профориентация</h2>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-3">Тест на профориентацию</h3>
          <p className="text-gray-700 mb-6">
            Пройдите тест для определения наиболее подходящих профессий на основе ваших интересов, навыков и личностных качеств.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl mb-2">
                <span role="img" aria-label="target">🎯</span>
              </div>
              <h4 className="font-bold mb-1">Определение целей</h4>
              <p className="text-sm text-gray-600">Выявление ваших карьерных приоритетов</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl mb-2">
                <span role="img" aria-label="brain">🧠</span>
              </div>
              <h4 className="font-bold mb-1">Анализ навыков</h4>
              <p className="text-sm text-gray-600">Оценка сильных и слабых сторон</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl mb-2">
                <span role="img" aria-label="rocket">🚀</span>
              </div>
              <h4 className="font-bold mb-1">Рекомендации</h4>
              <p className="text-sm text-gray-600">Персональные советы по выбору профессии</p>
            </div>
          </div>

          <button
            onClick={handleOpenCareerTest}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg flex items-center justify-center gap-3 transition-colors"
          >
            <Briefcase size={24} />
            <span>Пройти тест на профориентацию</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">Популярные направления</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="computer">💻</span>
                <div>
                  <div className="font-medium">IT и программирование</div>
                  <div className="text-sm text-gray-600">Разработка ПО, Data Science, AI</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="medical">⚕️</span>
                <div>
                  <div className="font-medium">Медицина и здравоохранение</div>
                  <div className="text-sm text-gray-600">Врачи, фармацевты, медсестры</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="engineering">⚙️</span>
                <div>
                  <div className="font-medium">Инженерия</div>
                  <div className="text-sm text-gray-600">Механика, электроника, строительство</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="business">📊</span>
                <div>
                  <div className="font-medium">Бизнес и экономика</div>
                  <div className="text-sm text-gray-600">Менеджмент, финансы, маркетинг</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">Полезные ресурсы</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium mb-1">Карьерные консультации</div>
                <p className="text-sm text-gray-600">Запишитесь на встречу с карьерным консультантом школы</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium mb-1">Дни открытых дверей</div>
                <p className="text-sm text-gray-600">Посещайте университеты и узнавайте о программах обучения</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium mb-1">Стажировки</div>
                <p className="text-sm text-gray-600">Получите практический опыт в интересующих областях</p>
              </div>
            </div>
          </div>
        </div>

        {gpaValue >= 4.0 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-green-900 mb-2">Отличная успеваемость!</h4>
                <p className="text-green-800">
                  Ваш высокий GPA открывает двери в престижные университеты и программы. Рекомендуем рассмотреть международные стипендиальные программы и топовые вузы Казахстана.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EventsPage = ({ user }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', grade: '' });

  const handleRegister = () => {
    if (!formData.firstName || !formData.lastName || !formData.grade) {
      alert('Заполните все поля');
      return;
    }
    alert('Вы успешно зарегистрировались на мероприятие!');
    setShowRegister(false);
    setFormData({ firstName: '', lastName: '', grade: '' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Мероприятия</h2>
        
        <div className="border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Хакатон</h3>
              <p className="text-gray-700 mb-4">Городской хакатон по разработке образовательных платформ</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={20} />
                  <span>25.11.2025</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span role="img" aria-label="location">📍</span>
                  <span>НИШ ФМН Актау</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={20} />
                  <span>0 зарегистрировано</span>
                </div>
              </div>
            </div>

            <div className="ml-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                <span role="img" aria-label="calendar">📅</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => setShowRegister(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Upload size={18} />
              <span>Регистрация</span>
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <span role="img" aria-label="phone">📱</span>
              <span>Подтвердить участие (QR)</span>
            </button>
          </div>
        </div>
      </div>

      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Регистрация на мероприятие</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold">Хакатон</h4>
              <p className="text-sm text-gray-600 mt-1">НИШ ФМН Актау</p>
              <p className="text-sm text-gray-600">25.11.2025</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Имя</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(Object.assign({}, formData, { firstName: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Фамилия</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(Object.assign({}, formData, { lastName: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Класс</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData(Object.assign({}, formData, { grade: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Выберите класс</option>
                  <option value="7">7 класс</option>
                  <option value="8">8 класс</option>
                  <option value="9">9 класс</option>
                  <option value="10">10 класс</option>
                  <option value="11">11 класс</option>
                  <option value="12">12 класс</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleRegister}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Зарегистрироваться
                </button>
                <button
                  onClick={() => setShowRegister(false)}
                  className="flex-1 bg-gray-100 py-3 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;text-left text-sm font-medium text-gray-700">Пользователь</th>
                  <th className="px-4 py-3 import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Upload, Users, Award, Bell, Home, FileText, Calendar, BarChart3, TrendingUp, Settings, UserPlus } from 'lucide-react';

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [allUsers, setAllUsers] = useState([
    { id: '1', email: 'student@akt.nis.edu.kz', firstName: 'Таган', lastName: 'Адлет', role: 'student', gpa: 0, badges: [], points: 1000 },
    { id: '2', email: 'admin@akt.nis.edu.kz', firstName: 'Administrator', lastName: '', role: 'admin', gpa: 0, badges: [], points: 0 }
  ]);

  const handleLogin = (email) => {
    const foundUser = allUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setPage('dashboard');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    setAllUsers(allUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const updateUserRole = (userId, newRole) => {
    setAllUsers(allUsers.map(u => u.id === userId ? {...u, role: newRole} : u));
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <Navigation user={user} page={page} setPage={setPage} />
      <main className="py-6">
        {page === 'dashboard' && <Dashboard user={user} updateUser={updateUser} />}
        {page === 'events' && <EventsPage user={user} />}
        {page === 'portfolio' && <Portfolio user={user} />}
        {page === 'admin' && user.role === 'admin' && <AdminPanel users={allUsers} updateUserRole={updateUserRole} currentUser={user} />}
      </main>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onLogin(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">NIS Aktau</h1>
          <p className="text-gray-600">Портфолио достижений</p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Используйте @akt.nis.edu.kz</p>
          </div>

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Войти
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
          <p className="font-medium mb-2">Тестовые аккаунты:</p>
          <p className="mb-1">admin@akt.nis.edu.kz (Администратор)</p>
          <p>student@akt.nis.edu.kz (Ученик)</p>
        </div>
      </div>
    </div>
  );
};

const Header = ({ user }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">NIS Portfolio</h1>
          
          <div className="flex items-center gap-4">
            {user.role === 'student' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-2xl">💎</span>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Баллы</span>
                  <span className="font-bold text-lg">{user.points}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <img 
                src="https://via.placeholder.com/40" 
                alt={user.firstName}
                className="w-10 h-10 rounded-full"
              />
              <div className="text-sm">
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-gray-500 text-xs capitalize">{user.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Navigation = ({ user, page, setPage }) => {
  const getNavItems = () => {
    const common = [
      { id: 'dashboard', icon: Home, label: 'Главная' },
      { id: 'events', icon: Calendar, label: 'Мероприятия' }
    ];

    if (user.role === 'student') {
      return [
        ...common,
        { id: 'portfolio', icon: FileText, label: 'Портфолио' }
      ];
    }

    if (user.role === 'admin') {
      return [
        ...common,
        { id: 'admin', icon: BarChart3, label: 'Админ панель' }
      ];
    }

    return common;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex items-center gap-2 px-4 py-3 ${
                page === item.id
                  ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Dashboard = ({ user, updateUser }) => {
  const [showSushModal, setShowSushModal] = useState(false);

  const getStatusColor = () => {
    const gpa = user.gpa || 0;
    if (gpa >= 4) return 'bg-green-500';
    if (gpa >= 3) return 'bg-blue-500';
    if (gpa >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRecommendations = () => {
    const gpa = user.gpa || 0;
    
    if (gpa >= 4.0) {
      return {
        status: 'excellent',
        message: 'Отличная работа! Ваш высокий GPA открывает новые возможности.',
        actions: [
          'Участие во внеклассных активностях',
          'Менторство младших учеников',
          'Участие в национальных конкурсах'
        ]
      };
    } else if (gpa >= 3.0) {
      return {
        status: 'good',
        message: 'Хороший прогресс! Давайте расширим ваши горизонты.',
        actions: [
          'Дополнительные уроки по слабым предметам',
          'Активное участие во внеклассных мероприятиях',
          'Развитие лидерских навыков'
        ]
      };
    } else if (gpa >= 2.0) {
      return {
        status: 'needs_improvement',
        message: 'Есть потенциал для роста. Сфокусируемся на улучшении.',
        actions: [
          'Улучшение успеваемости на уроках - приоритет',
          'Активное участие на дополнительных занятиях',
          'Консультации с учителями'
        ]
      };
    } else {
      return {
        status: 'critical',
        message: 'Начните с малого - каждый шаг важен для вашего развития.',
        actions: [
          'Консультация с куратором',
          'Составление плана улучшения',
          'Регулярные занятия'
        ]
      };
    }
  };

  const recommendations = user.role === 'student' ? getRecommendations() : null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Добро пожаловать, {user.firstName}!</h2>
        <p className="text-gray-600">Роль: {user.role === 'student' ? 'Ученик' : user.role === 'admin' ? 'Администратор' : user.role}</p>
      </div>

      {user.role === 'student' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Текущий GPA</span>
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              </div>
              <div className="text-4xl font-bold text-blue-600">{user.gpa.toFixed(2)}</div>
              
              <button
                onClick={() => setShowSushModal(true)}
                className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
              >
                <TrendingUp size={16} />
                <span>Импортировать с Дневника (СУШ)</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <span className="text-gray-600 block mb-2">Достижения</span>
              <div className="text-4xl font-bold text-green-600">0</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <span className="text-gray-600 block mb-2">Награды</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.badges && user.badges.length > 0 ? (
                  user.badges.map((badge, idx) => (
                    <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {badge}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">Нет наград</span>
                )}
              </div>
            </div>
          </div>

          {recommendations && (
            <div className={`rounded-xl shadow-sm p-6 ${
              recommendations.status === 'excellent' ? 'bg-green-50' :
              recommendations.status === 'good' ? 'bg-blue-50' :
              recommendations.status === 'needs_improvement' ? 'bg-yellow-50' :
              'bg-gray-50'
            }`}>
              <h3 className="font-bold text-lg mb-2">🤖 AI Рекомендации</h3>
              <p className="text-gray-700 mb-4">{recommendations.message}</p>
              <ul className="space-y-2">
                {recommendations.actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {user.role === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">Панель администратора</h3>
          <p className="text-gray-600 mb-4">Добро пожаловать в административную панель</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600 mt-1">Всего пользователей</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600 mt-1">Достижений</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600 mt-1">Мероприятий</div>
            </div>
          </div>
        </div>
      )}

      {showSushModal && (
        <SushImportModal 
          onClose={() => setShowSushModal(false)} 
          user={user}
          updateUser={updateUser}
        />
      )}
    </div>
  );
};

const SushImportModal = ({ onClose, user, updateUser }) => {
  const [iin, setIin] = useState('');
  const [password, setPassword] = useState('');
  const [importing, setImporting] = useState(false);

  const handleImport = () => {
    if (!iin || !password) {
      alert('Заполните все поля');
      return;
    }

    setImporting(true);
    
    setTimeout(() => {
      const updatedUser = {
        ...user,
        gpa: 4.85,
        badges: ['Honor Roll', 'Excellence Award']
      };
      updateUser(updatedUser);
      alert('GPA успешно импортирован: 4.85');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Импорт из СУШ</h3>
        
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
          Примечание: Используйте аккаунт СУШ
        </div>

        {!importing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ИИН</label>
              <input
                type="text"
                value={iin}
                onChange={(e) => setIin(e.target.value)}
                placeholder="Введите ИИН"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль СУШ</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleImport}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                Импортировать
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 py-3 rounded-lg hover:bg-gray-200 font-medium"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Импортирование данных из СУШ...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Portfolio = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Мое портфолио</h2>
        
        <div className="text-center py-12 text-gray-500">
          <Award size={48} className="mx-auto mb-4 opacity-50" />
          <p>У вас пока нет достижений</p>
          <p className="text-sm mt-2">Загрузите свои достижения для их отображения здесь</p>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = ({ users, updateUserRole, currentUser }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  const handleAssignRole = () => {
    if (selectedUser && newRole) {
      updateUserRole(selectedUser.id, newRole);
      alert(`Роль "${newRole}" назначена пользователю ${selectedUser.firstName} ${selectedUser.lastName}`);
      setSelectedUser(null);
      setNewRole('');
    }
  };

  const roles = [
    { value: 'student', label: 'Ученик' },
    { value: 'teacher', label: 'Учитель' },
    { value: 'curator', label: 'Куратор' },
    { value: 'organizer', label: 'Организатор' },
    { value: 'admin', label: 'Администратор' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Управление пользователями</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Settings size={18} />
            <span>Всего пользователей: {users.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Пользователь</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Текущая роль</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">GPA</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://via.placeholder.com/32"
                        className="w-8 h-8 rounded-full"
                        alt={u.firstName}
                      />
                      <span className="font-medium">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      u.role === 'admin' ? 'bg-red-100 text-red-800' :
                      u.role === 'teacher' ? 'bg-green-100 text-green-800' :
                      u.role === 'curator' ? 'bg-blue-100 text-blue-800' :
                      u.role === 'organizer' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{u.gpa.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSelectedUser(u); setNewRole(u.role); }}
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <UserPlus size={16} />
                      <span>Изменить роль</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Изменить роль пользователя</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Пользователь:</p>
              <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Новая роль</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAssignRole}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Назначить
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-gray-100 py-2 rounded-lg hover:bg-gray-200"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EventsPage = ({ user }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', grade: '' });

  const handleRegister = () => {
    if (!formData.firstName || !formData.lastName || !formData.grade) {
      alert('Заполните все поля');
      return;
    }
    alert('Вы успешно зарегистрировались на мероприятие!');
    setShowRegister(false);
    setFormData({ firstName: '', lastName: '', grade: '' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Мероприятия</h2>
        
        <div className="border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Хакатон</h3>
              <p className="text-gray-700 mb-4">Городской хакатон по разработке образовательных платформ</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={20} />
                  <span>25.11.2025</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📍</span>
                  <span>НИШ ФМН Актау</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={20} />
                  <span>0 зарегистрировано</span>
                </div>
              </div>
            </div>

            <div className="ml-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                📅
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => setShowRegister(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Upload size={18} />
              <span>Регистрация</span>
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <span>📱</span>
              <span>Подтвердить участие (QR)</span>
            </button>
          </div>
        </div>
      </div>

      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Регистрация на мероприятие</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold">Хакатон</h4>
              <p className="text-sm text-gray-600 mt-1">НИШ ФМН Актау</p>
              <p className="text-sm text-gray-600">25.11.2025</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Имя</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Фамилия</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Класс</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Выберите класс</option>
                  <option value="7">7 класс</option>
                  <option value="8">8 класс</option>
                  <option value="9">9 класс</option>
                  <option value="10">10 класс</option>
                  <option value="11">11 класс</option>
                  <option value="12">12 класс</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleRegister}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Зарегистрироваться
                </button>
                <button
                  onClick={() => setShowRegister(false)}
                  className="flex-1 bg-gray-100 py-3 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
