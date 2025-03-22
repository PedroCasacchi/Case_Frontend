"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type Ativo = {
  id: number;
  nome: string;
  valor: number;
  clienteId: number; // Usando clienteId ao invés de cliente completo
};

const fetchAtivos = async (): Promise<Ativo[]> => {
  const response = await fetch("http://localhost:3000/ativos");
  if (!response.ok) throw new Error("Erro ao buscar ativos");
  return response.json();
};

export default function AssetsPage() {
  const { data, isLoading, isError, error } = useQuery<Ativo[]>({
    queryKey: ["ativos"],
    queryFn: fetchAtivos,
  });

  if (isLoading)
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-[40px] w-[200px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );

  if (isError) return <div>Erro: {error.message}</div>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Ativos Financeiros</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ativo</TableHead>
                <TableHead>Valor Atual</TableHead>
                <TableHead>ID do Cliente</TableHead>{" "}
                {/* Exibindo o clienteId */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((ativo) => (
                <TableRow key={ativo.id}>
                  <TableCell className="font-medium">{ativo.nome}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(ativo.valor)}
                  </TableCell>
                  <TableCell>{ativo.clienteId}</TableCell>{" "}
                  {/* Exibindo o clienteId */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
