"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type AtivoPayload = {
  nome: string;
  valor: number;
  clienteId: number;
};

export default function AddAtivoForm({ clienteId }: { clienteId: number }) {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: AtivoPayload) => {
      const response = await fetch("http://localhost:3000/ativos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao adicionar ativo");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientes"],
      });
      setNome("");
      setValor("");
    },
  });

  const handleSubmit = () => {
    if (!nome || !valor) {
      return;
    }

    const numericValue = parseFloat(valor);
    if (isNaN(numericValue)) {
      return;
    }

    mutation.mutate({
      nome,
      valor: numericValue,
      clienteId, // Isso já está correto, o ID vem da prop
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Adicionar Ativo
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-lg font-medium mb-4">
          Novo Ativo Financeiro
        </DialogTitle>

        <DialogDescription className="sr-only">
          Formulário para adicionar novo ativo ao cliente
        </DialogDescription>

        <div className="space-y-4">
          <div>
            <Label>Nome do Ativo *</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ação XYZ"
              required
            />
          </div>
          <div>
            <Label>Valor Atual (R$) *</Label>
            <Input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ex: 1500.00"
              step="0.01"
              required
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Salvando..." : "Adicionar Ativo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
