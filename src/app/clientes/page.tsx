import ClientsTable from "../components/clientesTable";
import ClientsForm from "../components/clientesForm";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function ClientesPage() {
  return (
    <div className="flex justify-between items-center">
      <Dialog>
        <DialogTrigger asChild></DialogTrigger>
        <ClientsForm />
      </Dialog>
      <ClientsTable />
    </div>
  );
}
