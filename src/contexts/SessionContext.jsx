import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext(undefined);

export const SessionProvider = ({ children }) => {
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    return localStorage.getItem('nexus_tutorial_seen') === 'true';
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('nexus_sound_enabled') !== 'false';
  });

  const completeTutorial = () => {
    localStorage.setItem('nexus_tutorial_seen', 'true');
    setHasSeenTutorial(true);
  };

  useEffect(() => {
    localStorage.setItem('nexus_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  return (
    <SessionContext.Provider value={{ hasSeenTutorial, completeTutorial, soundEnabled, setSoundEnabled }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
