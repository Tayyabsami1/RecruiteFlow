import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {User}=useSelector((state)=>state.User);
    if(!User)
    return <Navigate to='/'/>

  return children; 
}

export default ProtectedRoute