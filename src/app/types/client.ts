export type Cliente = {
  id: number;
  nome: string;
  email: string;
  status: boolean;
  ativos: Ativo[];
};

export type Ativo = {
  id: number;
  nome: string;
  valor: number;
  clienteId: number;
};
