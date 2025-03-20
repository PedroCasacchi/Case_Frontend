"use client";

import { useEffect, useState } from "react";

interface Client {
  id: number;
  name: string;
}

export default function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Buscar clientes da API
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/clientes");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Adicionar um novo cliente
  const addClient = async (name: string) => {
    try {
      const response = await fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar cliente");

      const newClient = await response.json();
      setClients((prev) => [...prev, newClient]);
    } catch (error) {
      console.error(error);
    }
  };

  // ❌ Remover cliente
  const removeClient = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover cliente");

      setClients((prev) => prev.filter((client) => client.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // ✏️ Editar cliente
  const editClient = async (id: number, name: string) => {
    try {
      const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Erro ao editar cliente");

      const updatedClient = await response.json();
      setClients((prev) =>
        prev.map((client) =>
          client.id === id ? { ...client, name: updatedClient.name } : client
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, addClient, removeClient, editClient };
}
