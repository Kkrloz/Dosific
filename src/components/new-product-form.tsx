"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct } from "@/lib/actions";
import { Plus, ChevronDown, ChevronUp, Gauge } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface NewProductFormProps {
  categories: Category[];
}

const weightPresets = [
  { label: "900g", weight: 900, unit: "g" },
  { label: "1kg", weight: 1, unit: "kg" },
  { label: "2kg", weight: 2, unit: "kg" },
  { label: "5kg", weight: 5, unit: "kg" },
];

export function NewProductForm({ categories }: NewProductFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [unit, setUnit] = useState("g");
  const [doseUnit, setDoseUnit] = useState("g");
  const [packageWeight, setPackageWeight] = useState("");

  function handleCategoryChange(value: string | null) {
    setCategoryId(value ?? "");
  }
  function handleUnitChange(value: string | null) {
    setUnit(value ?? "g");
  }
  function handleDoseUnitChange(value: string | null) {
    setDoseUnit(value ?? "g");
  }

  function applyPreset(w: number, u: string) {
    setPackageWeight(String(w));
    setUnit(u);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createProduct(formData);
    if (result.success) {
      form.reset();
      setCategoryId("");
      setUnit("g");
      setDoseUnit("g");
      setPackageWeight("");
      setOpen(false);
      toast.success("Produto adicionado", {
        description: "Produto cadastrado com sucesso",
      });
      router.refresh();
    }
  }

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <Plus className="size-4 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-primary text-sm">Novo produto</p>
            <p className="text-xs text-muted-foreground">Adicionar produto para calcular custo por dose</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3 animate-fade-in-up">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nome do produto</Label>
                <Input id="name" name="name" placeholder="Ex: Whey Growth" required />
              </div>

              <div>
                <Label>Categoria</Label>
                <Select value={categoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="categoryId" value={categoryId} />
              </div>

              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" name="price" type="number" step="0.01" placeholder="89,90" required />
              </div>

              <div>
                <Label>Peso total</Label>
                <div className="flex gap-1">
                  <div className="flex-1">
                    <Input
                      name="packageWeight"
                      type="number"
                      step="0.1"
                      placeholder="900"
                      value={packageWeight}
                      onChange={(e) => setPackageWeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-16">
                    <Select value={unit} onValueChange={handleUnitChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="unit" value={unit} />
                  </div>
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  {weightPresets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPreset(p.weight, p.unit)}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Dose</Label>
                <div className="flex gap-1">
                  <div className="flex-1">
                    <Input name="doseSize" type="number" step="0.1" placeholder="30" required />
                  </div>
                  <div className="w-16">
                    <Select value={doseUnit} onValueChange={handleDoseUnitChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="doseUnit" value={doseUnit} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Gauge className="size-3.5" />
                <Label htmlFor="bonus" className="text-xs font-normal cursor-pointer">
                  Bônus (g/ml extra)
                </Label>
                <Input
                  id="bonus"
                  name="bonus"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  className="w-16 h-7 text-xs"
                />
              </div>
              <Button type="submit" className="ml-auto bg-accent hover:bg-emerald-600">
                Adicionar
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}
