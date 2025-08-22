import { useNavigate } from "react-router-dom";

function MyInformation({
  id,
  name,
  email,
}: {
  id: string;
  name: string;
  email?: string;
}) {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className="p-4 bg-primary border-2 border-black rounded-md shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform">
      <p className="font-bold text-white mb-1">
        ID: <span className="font-normal">{id}</span>
      </p>
      <p className="font-bold text-white mb-1">
        Name: <span className="font-normal">{name}</span>
      </p>
      <p className="font-bold text-white mb-2">
        Email: <span className="font-normal">{email || "No Email Found"}</span>
      </p>
      <button
        onClick={goToProfile}
        className="mt-2 px-3 py-1 bg-white text-primary font-bold border-2 border-black rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
      >
        View Profile
      </button>
    </div>
  );
}

export default MyInformation;
