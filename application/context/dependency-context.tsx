import React, { createContext, useMemo, useEffect } from "react";
import { DiFactory } from "@/application/factory/di-factory";
import { DependencyContextType } from "@/domain/context/entities";
import { setupNotifications } from "@/infrastructure/notifications/notification-handler";

export const DependencyContext = createContext<DependencyContextType | null>(null);

export const DependencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useMemo(() => ({
        foodRepository: DiFactory.createFoodRepository(),
        wasteRepository: DiFactory.createWasteRepository(),
        shoppingRepository: DiFactory.createShoppingRepository(),
        notificationsRepository: DiFactory.createNotificationRepository(),
    }), []);

    useEffect(() => {
        setupNotifications();
        value.notificationsRepository.requestPermissions().catch(console.error);
    }, [value.notificationsRepository]);

    return (
        <DependencyContext.Provider value={value}>
            {children}
        </DependencyContext.Provider>
    );
};
