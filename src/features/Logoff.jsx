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
		<button onClick={handleLogout}>Logoff</button>
	 </div>
  )
}

export default Logoff