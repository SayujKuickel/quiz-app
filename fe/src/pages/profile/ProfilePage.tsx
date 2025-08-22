import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface ISkill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface IProfile {
  user: {
    name: string;
    email: string;
  };
  bio?: string;
  profilePicture?: string;
  skills?: ISkill[];
  github?: string;
  linkedin?: string;
  portfolioUrl?: string;
}

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const url = id
          ? `http://localhost:3000/users/profile/${id}`
          : `http://localhost:3000/users/profile/me`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProfile(res.data.profile);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div className="min-h-screen flex justify-center p-6 bg-gray-100">
      <div className="max-w-3xl h-fit w-full p-8 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-md space-y-4">
        {profile.profilePicture && (
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto border-2 border-black"
          />
        )}
        <h1 className="text-3xl font-extrabold text-primary text-center">
          {profile.user.name}
        </h1>
        <p className="text-center font-bold">{profile.user.email}</p>
        {profile.bio && <p className="italic">"{profile.bio}"</p>}

        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h2 className="font-bold text-lg">Skills:</h2>
            <ul className="list-disc pl-6">
              {profile.skills.map((skill, idx) => (
                <li key={idx}>
                  {skill.name} — {skill.level}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-1">
          {profile.github && (
            <p>
              Github:{" "}
              <a
                href={profile.github}
                target="_blank"
                className="text-primary underline"
              >
                {profile.github}
              </a>
            </p>
          )}
          {profile.linkedin && (
            <p>
              LinkedIn:{" "}
              <a
                href={profile.linkedin}
                target="_blank"
                className="text-primary underline"
              >
                {profile.linkedin}
              </a>
            </p>
          )}
          {profile.portfolioUrl && (
            <p>
              Portfolio:{" "}
              <a
                href={profile.portfolioUrl}
                target="_blank"
                className="text-primary underline"
              >
                {profile.portfolioUrl}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
