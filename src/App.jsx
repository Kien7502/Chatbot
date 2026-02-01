import React, { useState } from 'react';
import Layout from './layouts/Layout';
import TeacherConsole from './features/TeacherConsole/TeacherConsole';
import WritingSession from './features/WritingSession/WritingSession';
import ReflectionView from './features/Reflection/ReflectionView';

function App() {
  const [sessionState, setSessionState] = useState('CONFIG'); // CONFIG, WRITING, REFLECTION
  const [sessionData, setSessionData] = useState(null);
  const [writingResult, setWritingResult] = useState(null);

  const startSession = (data) => {
    setSessionData(data);
    setSessionState('WRITING');
  };

  const completeSession = (result) => {
    setWritingResult(result);
    setSessionState('REFLECTION');
  };

  const resetSession = () => {
    setSessionState('CONFIG');
    setSessionData(null);
    setWritingResult(null);
  };

  return (
    <Layout>
      {sessionState === 'CONFIG' && (
        <TeacherConsole onStart={startSession} />
      )}

      {sessionState === 'WRITING' && (
        <WritingSession
          sessionData={sessionData}
          onComplete={completeSession}
        />
      )}

      {sessionState === 'REFLECTION' && (
        <ReflectionView
          sessionData={sessionData}
          result={writingResult}
          onReset={resetSession}
        />
      )}
    </Layout>
  );
}

export default App;
