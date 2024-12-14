import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import logo from './logo.svg';
import './App.css';
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  return (
    <div className="App">
     <Dashboard/>
     <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
