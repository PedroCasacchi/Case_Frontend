"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Definir o tipo Cliente
type Cliente = {
  id: number;
  nome: string;
  email: string;
  status: boolean;
};

const ClientsTable = () => {
  // Usar o tipo Cliente no useState
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost:3000/clientes");
        const data: Cliente[] = await response.json(); // Tipando a resposta da API
        setClientes(data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {clientes.map((cliente) => (
        <Card key={cliente.id} className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <h3 className="text-lg font-semibold">{cliente.nome}</h3>
            <p className="text-sm text-gray-500">{cliente.email}</p>
          </CardHeader>
          <CardContent>
            <p>Status: {cliente.status ? "Ativo" : "Inativo"}</p>
            <Button variant="default" className="mt-4">
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientsTable;
