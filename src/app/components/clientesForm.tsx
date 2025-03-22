"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Cliente } from "../types/client";
import { useState } from "react";

// Schema de validação com Zod
const clientSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  status: z.boolean().default(true),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function ClientsForm({ cliente }: { cliente?: Cliente }) {
  const queryClient = useQueryClient();
  const isEditMode = !!cliente;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Configuração do react-hook-form
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

  // Mutação de salvar cliente (POST ou PUT)
  const mutation = useMutation<Cliente, Error, ClientFormData>({
    mutationFn: async (data) => {
      const url = isEditMode
        ? `http://localhost:3000/clientes/${cliente?.id}`
        : "http://localhost:3000/clientes";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar cliente"); // Acessando o campo 'error' da resposta
      }

      return response.json();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        // Agora você pode acessar com segurança as propriedades do Error
        const message = error.message || "Erro desconhecido";
        setErrorMessage(message); // Exibe a mensagem de erro do backend
      } else {
        // Caso o erro não seja do tipo Error, mostramos um erro genérico
        setErrorMessage("Erro desconhecido");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      reset();
      setErrorMessage(null); // Limpa a mensagem de erro em caso de sucesso
    },
  });

  // Função de submit
  const onSubmit = (data: ClientFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Editar Cliente" : "Criar Novo Cliente"}
      </h2>

      {/* Mensagem de erro global (backend) */}
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo Nome */}
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" {...register("nome")} />
          {errors.nome && (
            <p className="text-red-500 text-sm">{errors.nome.message}</p> // Erro de validação de nome
          )}
        </div>

        {/* Campo Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p> // Erro de validação de email
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
