"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      // Get the currently logged-in user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.log("User fetch error:", userError);
        setLoading(false);
        return;
      }

      const user = userData.user;

      // Fetch profile from "profiles" table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.log("Profile fetch error:", profileError);
      } else {
        setProfile(profileData);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div className="p-10">
      <img
        src={profile.avatar}
        alt={profile.name || "User avatar"}
        className="w-24 h-24 rounded-full mb-4"
      />
      <h1 className="text-2xl font-bold">{profile.name}</h1>
      <p>Email: {profile.email}</p>
      <p>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
    </div>
  );
}
