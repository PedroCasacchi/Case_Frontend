"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { Cliente } from "../types/client";

// Função para buscar os clientes e seus ativos
const fetchClientes = async () => {
  const response = await fetch("http://localhost:3000/clientes");
  if (!response.ok) throw new Error("Erro ao buscar clientes");
  return response.json();
};

// Função para editar um cliente
const editCliente = async (cliente: Cliente) => {
  const clienteData = {
    nome: cliente.nome,
    email: cliente.email,
    status: cliente.status,
  };

  const response = await fetch(`http://localhost:3000/clientes/${cliente.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clienteData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Falha ao editar cliente");
  }

  return response.json();
};

// Função para ativar um cliente
const activateCliente = async (id: number) => {
  const response = await fetch(`http://localhost:3000/clientes/ativar/${id}`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error("Falha ao ativar cliente");
  return response.json();
};

// Função para inativar um cliente
const deactivateCliente = async (id: number) => {
  const response = await fetch(
    `http://localhost:3000/clientes/inativar/${id}`,
    {
      method: "PUT",
    }
  );
  if (!response.ok) throw new Error("Falha ao inativar cliente");
  return response.json();
};

const ClientsTable = () => {
  const queryClient = useQueryClient();
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Cliente | null>(null);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

  // Query para buscar clientes
  const { data, isLoading, isError } = useQuery({
    queryKey: ["clientes"],
    queryFn: fetchClientes,
  });

  // Mutation para deletar cliente
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Falha ao excluir cliente");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });

  // Mutation para editar cliente
  const updateMutation = useMutation({
    mutationFn: editCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setEditingCliente(null);
      setFormData(null); // Limpar o estado do formulário após sucesso
    },
    onError: (error) => {
      console.error("Erro na atualização:", error);
      alert(error instanceof Error ? error.message : "Erro desconhecido");
    },
  });

  // Mutation para ativar cliente
  const activateMutation = useMutation({
    mutationFn: activateCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "Erro desconhecido");
    },
  });

  // Mutation para inativar cliente
  const deactivateMutation = useMutation({
    mutationFn: deactivateCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "Erro desconhecido");
    },
  });

  const handleEditClick = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({ ...cliente });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Cliente
  ) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updateMutation.mutate(formData); // Atualiza o cliente
    }
  };

  const handleViewAtivos = (cliente: Cliente) => {
    setSelectedClient(cliente); // Seleciona o cliente e exibe os ativos dele
  };

  const handleCloseAtivos = () => {
    setSelectedClient(null); // Fecha a visualização dos ativos
  };

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar clientes.</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Lista de Clientes</h2>
      <ul className="space-y-2">
        {data?.map((cliente: Cliente) => (
          <li
            key={cliente.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <span className="mr-2">{cliente.nome}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  cliente.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {cliente.status ? "Ativo" : "Inativo"}
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <Dialog
                open={editingCliente?.id === cliente.id}
                onOpenChange={(open) => !open && setEditingCliente(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(cliente)}
                  >
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Editar Cliente</DialogTitle>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                          id="nome"
                          value={formData?.nome || ""}
                          onChange={(e) => handleInputChange(e, "nome")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData?.email || ""}
                          onChange={(e) => handleInputChange(e, "email")}
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => setEditingCliente(null)}
                      >
                        Cancelar
                      </Button>
                      <Button variant="default" size="sm" type="submit">
                        Salvar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(cliente.id)}
              >
                Excluir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => activateMutation.mutate(cliente.id)}
                disabled={cliente.status}
              >
                Ativar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deactivateMutation.mutate(cliente.id)}
                disabled={!cliente.status}
              >
                Inativar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleViewAtivos(cliente)}
              >
                Ver Ativos
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal ou seção para exibir os ativos do cliente */}
      {selectedClient && (
        <Dialog open={true} onOpenChange={() => handleCloseAtivos()}>
          <DialogContent>
            <DialogTitle>Ativos de {selectedClient.nome}</DialogTitle>
            <ul className="space-y-2 mt-4">
              {selectedClient.ativos?.map((ativo) => (
                <li key={ativo.id} className="border p-2 rounded">
                  {ativo.nome} - R${ativo.valor.toFixed(2)}
                </li>
              ))}
            </ul>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={handleCloseAtivos}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientsTable;
