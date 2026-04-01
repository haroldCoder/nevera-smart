import { useState, useEffect, useCallback } from "react";
import { ShoppingItem } from "@/domain/shopping/entities";
import { generateId } from "@/shared/helpers";
import { useRepositories } from "@/application/hooks/use-repositories";

export function useShopping() {
  const { shoppingRepository: repository } = useRepositories();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await repository.getShoppingItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (name: string, suggested = false) => {
    const item: ShoppingItem = {
      id: generateId(),
      name,
      completed: false,
      suggested,
      addedAt: new Date().toISOString(),
    };
    await repository.addShoppingItem(item);
    setItems((prev) => [...prev, item]);
  }, [repository]);

  const toggle = useCallback(async (id: string) => {
    await repository.toggleShoppingItem(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
  }, [repository]);

  const remove = useCallback(async (id: string) => {
    await repository.deleteShoppingItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, [repository]);

  const clearCompleted = useCallback(async () => {
    await repository.clearCompletedShoppingItems();
    setItems((prev) => prev.filter((i) => !i.completed));
  }, [repository]);

  const pendingCount = items.filter((i) => !i.completed).length;

  return { items, loading, add, toggle, remove, clearCompleted, pendingCount };
}
