"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/api/api";

const Autorisation = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = await getAuth();
      if (token) {
        setIsAuthorized(true);
      } else {
        router.push("/auth/login");
      }
    };

    checkAuthorization();
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default Autorisation;
