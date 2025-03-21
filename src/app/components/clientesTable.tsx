"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Cliente } from "../types/client";
import ClientsForm from "./clientesForm";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const fetchClientes = async (): Promise<Cliente[]> => {
  const response = await fetch("http://localhost:3000/clientes");
  if (!response.ok) throw new Error("Erro ao buscar clientes");
  return response.json();
};

const ClientsTable = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<Cliente[]>({
    queryKey: ["clientes"],
    queryFn: fetchClientes,
  });

  const deleteMutation = useMutation({
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

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-[40px] w-full" />
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        Erro: {error.message}
        <Button
          variant="outline"
          className="ml-4"
          onClick={() => queryClient.refetchQueries({ queryKey: ["clientes"] })}
        >
          Tentar novamente
        </Button>
      </div>
    );

  return (
    <Card className="border-none shadow-lg">
      <Table className="min-w-[1000px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[25%]">Nome</TableHead>
            <TableHead className="w-[30%]">Email</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="w-[20%]">Ativos</TableHead>
            <TableHead className="w-[10%] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((cliente) => (
            <TableRow key={cliente.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{cliente.nome}</TableCell>
              <TableCell className="text-gray-600">{cliente.email}</TableCell>

              <TableCell>
                <Badge
                  variant={cliente.status ? "default" : "destructive"}
                  className="w-fit px-3 py-1"
                >
                  {cliente.status ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1">
                  {cliente.ativos.map((ativo) => (
                    <div
                      key={ativo.id}
                      className="flex items-center gap-4" // Alterado aqui
                    >
                      <span className="text-sm font-medium">{ativo.nome}</span>
                      <span className="text-sm text-gray-500">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(ativo.valor)}
                      </span>
                    </div>
                  ))}
                  {cliente.ativos.length === 0 && (
                    <span className="text-sm text-gray-400">Nenhum ativo</span>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex gap-2 justify-end items-center">
                  <div className="flex gap-15">
                    {" "}
                    <Dialog>
                      <DialogTrigger asChild></DialogTrigger>
                      <ClientsForm cliente={cliente} />
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => deleteMutation.mutate(cliente.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ClientsTable;
