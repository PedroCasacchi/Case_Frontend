// app/clientLayout.tsx
"use client"; // Marca o arquivo como Client Component

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query"; // Certifique-se de que este arquivo exporta o queryClient corretamente

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
