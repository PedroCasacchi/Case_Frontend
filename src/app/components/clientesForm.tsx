"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Cliente } from "../types/client";

const clientSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  status: z.boolean().default(true),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function ClientsForm({ cliente }: { cliente?: Cliente }) {
  const queryClient = useQueryClient();
  const isEditMode = !!cliente;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: cliente || {
      nome: "",
      email: "",
      status: true,
    },
  });

  // Corrigindo a tipagem da mutation
  const mutation = useMutation<Cliente, Error, ClientFormData>({
    mutationFn: async (data) => {
      const url = isEditMode
        ? `http://localhost:3000/clientes/${cliente.id}`
        : "http://localhost:3000/clientes";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao salvar cliente");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] }); // Corrigindo invalidação
      reset();
    },
  });

  // Corrigindo o handler do submit
  const onSubmit = (data: ClientFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Editar Cliente" : "Criar Novo Cliente"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Nome</Label>
          <Input {...register("nome")} />
          {errors.nome && (
            <p className="text-red-500 text-sm">
              {errors.nome.message!} {/* Adicionando non-null assertion */}
            </p>
          )}
        </div>

        <div>
          <Label>Email</Label>
          <Input {...register("email")} type="email" />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message!} {/* Adicionando non-null assertion */}
            </p>
          )}
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Salvando..."
            : isEditMode
            ? "Atualizar"
            : "Criar"}
        </Button>
      </form>
    </div>
  );
}
