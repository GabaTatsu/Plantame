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
    return (
        <Router>
            <div className="App">
                {/* Encabezado, navegación u otros elementos globales */}

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/not-found" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/not-found" />} />
                </Routes>

                {/* Pie de página u otros elementos globales */}
            </div>
        </Router>
    );
};

export default App;
