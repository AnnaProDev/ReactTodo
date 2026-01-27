import { useAuth } from "./../contexts/AuthContext"

const Logoff = () => {
	const { logout } = useAuth();

const handleLogout = async () => {
  const result = await logout();

  if (!result.success) {
    console.error(result.error);
  }
};

  return (
	 <div>
		<button className="btn btn--secondary" onClick={handleLogout}>Logoff</button>
	 </div>
  )
}

export default Logoff