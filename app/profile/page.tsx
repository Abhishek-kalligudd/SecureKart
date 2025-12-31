"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return console.log(userError);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) console.log(profileError);
      else setProfile(profileData);
    };
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="p-10">
      <img src={profile.avatar} className="w-24 h-24 rounded-full mb-4" />
      <h1 className="text-2xl font-bold">{profile.name}</h1>
      <p>Email: {profile.email}</p>
      <p>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
    </div>
  );
}
