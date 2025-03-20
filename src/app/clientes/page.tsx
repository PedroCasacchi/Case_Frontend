// pages/clientes/page.tsx
// import ClientsForm from "../components/clientesForm";
import ClientsTable from "../components/clientesTable";

const ClientesPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>
      {/* Formulário para criar novo cliente */}

      {/* Tabela com a listagem de clientes */}
      <ClientsTable />
    </div>
  );
};

export default ClientesPage;
