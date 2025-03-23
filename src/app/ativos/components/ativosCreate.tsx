"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Ativo = {
  nome: string;
  valor: number;
  clienteId: number;
};

const createAtivo = async (ativo: Ativo) => {
  const response = await fetch(
    `http://localhost:3000/ativos/${ativo.clienteId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: ativo.nome,
        valorAtual: ativo.valor,
        clienteId: ativo.clienteId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao criar ativo");
  }

  return response.json();
};

export default function CreateAtivo() {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controle de abertura do Dialog
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAtivo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ativos"] });
      setNome("");
      setValor("");
      setClienteId("");
      setIsDialogOpen(false); // Fechar o Dialog após sucesso
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "Erro desconhecido");
    },
  });

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => setIsDialogOpen(open)}
      >
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)}>
            Criar Novo Ativo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Ativo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome do Ativo</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div>
              <Label>Valor Atual</Label>
              <Input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            <div>
              <Label>ID do Cliente</Label>
              <Input
                type="number"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)} // Fecha o diálogo ao cancelar
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() =>
                  mutation.mutate({
                    nome,
                    valor: Number(valor),
                    clienteId: Number(clienteId),
                  })
                }
              >
                Criar Ativo
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
