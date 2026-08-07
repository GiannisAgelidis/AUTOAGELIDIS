"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { deleteCar } from "@/app/[locale]/admin/cars/actions";

export default function DeleteCarButton({
  carId,
  confirmMessage,
  label,
}: {
  carId: string;
  confirmMessage: string;
  label: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmMessage)) return;
    setPending(true);
    await deleteCar(carId);
    setPending(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
    >
      {label}
    </button>
  );
}
