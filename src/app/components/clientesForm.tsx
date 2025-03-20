"use client";

// components/ClientsForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ClientsForm = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newClient = { nome, email };

    try {
      const response = await fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });

      if (response.ok) {
        const cliente = await response.json();
        console.log("Cliente criado:", cliente);
        setNome("");
        setEmail("");
      } else {
        console.error("Erro ao criar cliente");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Criar Novo Cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome:</Label>
          <Input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email:</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button variant="default" type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Cliente"}
        </Button>
      </form>
    </div>
  );
};

export default ClientsForm;
