import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ClinicForm from "./components/form";

const CardClinicForm = () => {
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar clínica</DialogTitle>
          <DialogDescription>Informe o nome de sua clínica.</DialogDescription>
        </DialogHeader>
        <ClinicForm />
      </DialogContent>
    </Dialog>
  );
};

export default CardClinicForm;
