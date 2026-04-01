import React, { createContext, useMemo } from "react";
import { DiFactory } from "@/application/factory/di-factory";
import { DependencyContextType } from "@/domain/context/entities";

export const DependencyContext = createContext<DependencyContextType | null>(null);

export const DependencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useMemo(() => ({
        foodRepository: DiFactory.createFoodRepository(),
        wasteRepository: DiFactory.createWasteRepository(),
        shoppingRepository: DiFactory.createShoppingRepository(),
        notificationsRepository: DiFactory.createNotificationRepository(),
    }), []);

    return (
        <DependencyContext.Provider value={value}>
            {children}
        </DependencyContext.Provider>
    );
};
