import { useState, useEffect, useCallback } from "react";
import {
  ShoppingItem,
  getShoppingItems,
  saveShoppingItems,
  addShoppingItem,
  toggleShoppingItem,
  deleteShoppingItem,
  clearCompletedShoppingItems,
  generateId,
} from "@/lib/store";

export function useShopping() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getShoppingItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

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
    await addShoppingItem(item);
    setItems((prev) => [...prev, item]);
  }, []);

  const toggle = useCallback(async (id: string) => {
    await toggleShoppingItem(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteShoppingItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCompleted = useCallback(async () => {
    await clearCompletedShoppingItems();
    setItems((prev) => prev.filter((i) => !i.completed));
  }, []);

  const pendingCount = items.filter((i) => !i.completed).length;

  return { items, loading, add, toggle, remove, clearCompleted, pendingCount };
}
