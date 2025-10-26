'use client'
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const TanstackProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return <div>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </div>;
};

export default TanstackProvider;
