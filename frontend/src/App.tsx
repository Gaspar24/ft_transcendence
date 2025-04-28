import { Routes, Route } from 'react-router-dom';
import { GameCanvas } from './Game';
import Welcome from './Welcome';
import Login from './Login';
import SignUp from './signUp';
import Dashboard from './Dashboard';

function App() {
    return (
            <div>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/game" element={<GameCanvas />} />
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="*" element={<Welcome />} /> {/* Redirect to Welcome for any other route */}
                </Routes>
            </div>
        // </div>
    );
}

export default App;