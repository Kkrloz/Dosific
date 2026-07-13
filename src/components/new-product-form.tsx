"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
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

interface Category {
  id: string;
  name: string;
}

interface NewProductFormProps {
  categories: Category[];
}

export function NewProductForm({ categories }: NewProductFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createProduct(formData);
    if (result.success) {
      form.reset();
      router.refresh();
    }
  }

  return (
    <Card className="p-4">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-end">
          <div className="lg:col-span-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" placeholder="Whey Growth" required />
          </div>

          <div>
            <Label htmlFor="categoryId">Categoria</Label>
            <Select name="categoryId" required>
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
          </div>

          <div>
            <Label htmlFor="price">Preço (R$)</Label>
            <Input id="price" name="price" type="number" step="0.01" placeholder="89,90" required />
          </div>

          <div className="flex gap-1">
            <div className="flex-1">
              <Label htmlFor="packageWeight">Peso</Label>
              <Input id="packageWeight" name="packageWeight" type="number" step="0.1" placeholder="900" required />
            </div>
            <div className="w-16">
              <Label htmlFor="unit">Unid</Label>
              <Select name="unit" defaultValue="g">
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
            </div>
          </div>

          <div className="flex gap-1">
            <div className="flex-1">
              <Label htmlFor="doseSize">Dose</Label>
              <Input id="doseSize" name="doseSize" type="number" step="0.1" placeholder="30" required />
            </div>
            <div className="w-16">
              <Label htmlFor="doseUnit">Unid</Label>
              <Select name="doseUnit" defaultValue="g">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full bg-accent hover:bg-emerald-600">
              Adicionar
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Label htmlFor="bonus" className="text-xs">Bônus (g/ml extra, opcional)</Label>
          <Input id="bonus" name="bonus" type="number" step="0.1" placeholder="0" className="w-20 h-7 text-xs" />
        </div>
      </form>
    </Card>
  );
}
