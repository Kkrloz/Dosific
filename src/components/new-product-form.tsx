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
    <Card className={`overflow-hidden border border-border/40 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 ${open ? 'ring-1 ring-emerald-500/20 shadow-md' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4.5 text-left hover:bg-emerald-500/[0.02] dark:hover:bg-emerald-500/[0.01] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={`size-9 rounded-lg flex items-center justify-center transition-colors duration-300 ${open ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
            <Plus className={`size-4 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
          </div>
          <div>
            <p className="font-bold text-primary text-sm tracking-tight">Novo Produto</p>
            <p className="text-xs text-muted-foreground">Cadastre um produto para comparar o custo por dose</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border/40 p-5 animate-fade-in-up bg-card/30">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Coluna 1: Informações Gerais */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Informações Gerais</h4>
                
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">Nome do Produto</Label>
                  <Input id="name" name="name" placeholder="Ex: Creatina Creapure" required className="bg-background/50" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Categoria</Label>
                    <Select value={categoryId} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="bg-background/50">
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

                  <div className="space-y-1">
                    <Label htmlFor="price" className="text-xs font-medium text-muted-foreground">Preço (R$)</Label>
                    <Input id="price" name="price" type="number" step="0.01" placeholder="89,90" required className="bg-background/50" />
                  </div>
                </div>
              </div>

              {/* Coluna 2: Embalagem e Dosagem */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Embalagem e Dosagem</h4>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Peso / Volume Total</Label>
                  <div className="flex gap-1.5">
                    <div className="flex-1">
                      <Input
                        name="packageWeight"
                        type="number"
                        step="0.1"
                        placeholder="900"
                        value={packageWeight}
                        onChange={(e) => setPackageWeight(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div className="w-20">
                      <Select value={unit} onValueChange={handleUnitChange}>
                        <SelectTrigger className="bg-background/50">
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
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground mr-0.5">Sugestões:</span>
                    {weightPresets.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyPreset(p.weight, p.unit)}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-background/50 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/20 transition-all duration-200 cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Dose Recomendada</Label>
                  <div className="flex gap-1.5">
                    <div className="flex-1">
                      <Input name="doseSize" type="number" step="0.1" placeholder="3" required className="bg-background/50" />
                    </div>
                    <div className="w-20">
                      <Select value={doseUnit} onValueChange={handleDoseUnitChange}>
                        <SelectTrigger className="bg-background/50">
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
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-2 flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border/40">
                <Gauge className="size-3.5 text-emerald-500" />
                <Label htmlFor="bonus" className="text-xs font-medium cursor-pointer">
                  Bônus Extra (g/ml):
                </Label>
                <Input
                  id="bonus"
                  name="bonus"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  className="w-16 h-7 text-xs bg-background/60"
                />
              </div>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-sm hover:shadow shadow-emerald-500/10 active:translate-y-[1px] transition-all px-6">
                Adicionar Produto
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}
