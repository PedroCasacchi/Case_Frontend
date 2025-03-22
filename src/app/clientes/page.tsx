import ClientsTable from "../components/clientesTable";
import ClientsForm from "../components/clientesForm";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function ClientesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Dialog>
        <DialogTrigger asChild>
          {/* Trigger do botão ou outro elemento para abrir o formulário */}
        </DialogTrigger>
        <ClientsForm />
      </Dialog>
      <ClientsTable />
    </div>
  );
}
