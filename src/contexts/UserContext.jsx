import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  // Всегда возвращаем значения, даже если контекст недоступен
  if (!context) {
    console.warn('UserContext not found in useUser hook');
    return { 
      user: { 
        id: 1,
        username: 'fallback_user',
        full_name: 'Fallback User',
        photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fallback',
        rating: 4.0,
        reviews_count: 0,
        active_listings: 0,
        sold_items: 0,
        balance: 0,
        location: 'Unknown',
        bio: 'Fallback user data',
        member_since: '2024',
      }, 
      loading: false, 
      toggleFavorite: () => {}, 
      updateUser: () => {},
      isAuthenticated: true,
      token: null,
      logout: () => {},
      refreshUserData: () => {},
      appMode: 'browser'
    };
  }
  return context;
};

export const UserProvider = ({ children }) => {
  console.log('UserProvider rendering');

  // Простейшие демо-данные - сразу устанавливаем без загрузки
  const [user] = useState({
    id: 1,
    username: 'demo_user',
    full_name: 'Демонстрационный пользователь',
    photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
    rating: 4.5,
    reviews_count: 10,
    active_listings: 5,
    sold_items: 25,
    balance: 15000,
    location: 'Москва',
    bio: 'Демонстрационный профиль для тестирования приложения.',
    member_since: '2024',
  });

  const updateUser = (updatedData) => {
    console.log('updateUser called:', updatedData);
  };

  const value = {
    user,
    loading: false,
    token: null,
    logout: () => console.log('Logout (demo mode)'),
    updateUser,
    refreshUserData: () => console.log('Refreshing user data (demo mode)'),
    isAuthenticated: true,
    appMode: 'browser',
  };

  console.log('UserContext providing value with user:', user);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
