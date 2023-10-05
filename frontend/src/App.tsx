import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
    document.title = 'Plántame';
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
        </Router>
    );
};

export default App;
