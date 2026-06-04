import { useEffect, useState } from 'react';

export const useTelegram = () => {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Проверка наличия Telegram WebApp API
    if (window.Telegram && window.Telegram.WebApp) {
      const telegram = window.Telegram.WebApp;
      setTg(telegram);

      // Получение данных пользователя
      if (telegram.initDataUnsafe && telegram.initDataUnsafe.user) {
        setUser(telegram.initDataUnsafe.user);
      }

      // Отслеживание состояния expanded
      setExpanded(telegram.isExpanded);

      // Настройка темы
      telegram.ready();
      telegram.expand();

      // Слушатель изменения размера
      const handleViewportChanged = () => {
        setExpanded(telegram.isExpanded);
      };

      telegram.onEvent('viewportChanged', handleViewportChanged);

      return () => {
        telegram.offEvent('viewportChanged', handleViewportChanged);
      };
    }
  }, []);

  const onClose = () => {
    if (tg) {
      tg.close();
    }
  };

  const showMainButton = (text, callback) => {
    if (tg) {
      tg.MainButton.text = text;
      tg.MainButton.show();
      if (callback) {
        tg.MainButton.onClick(callback);
      }
    }
  };

  const hideMainButton = () => {
    if (tg) {
      tg.MainButton.hide();
    }
  };

  const showBackButton = (callback) => {
    if (tg) {
      tg.BackButton.show();
      if (callback) {
        tg.BackButton.onClick(callback);
      }
    }
  };

  const hideBackButton = () => {
    if (tg) {
      tg.BackButton.hide();
    }
  };

  const showAlert = (message) => {
    if (tg) {
      tg.showAlert(message);
    }
  };

  const showConfirm = (message, callback) => {
    if (tg) {
      tg.showConfirm(message, callback);
    }
  };

  const hapticFeedback = {
    impactOccurred: (style = 'medium') => {
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(style);
      }
    },
    notificationOccurred: (type = 'success') => {
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred(type);
      }
    },
    selectionChanged: () => {
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
      }
    },
  };

  return {
    tg,
    user,
    expanded,
    onClose,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showAlert,
    showConfirm,
    hapticFeedback,
  };
};

export default useTelegram;
