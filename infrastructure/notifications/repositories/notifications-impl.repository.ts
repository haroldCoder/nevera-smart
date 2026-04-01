import { FoodItem } from "@/domain/foods/entities";
import { NotificationsRepository } from "@/domain/notifications";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export class NotificationsImplRepository implements NotificationsRepository {
    /**
     * Request permissions for push notifications (local notifications on Android/iOS).
     */
    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === "web") return false;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.warn("Permission for notifications not granted!");
            return false;
        }

        // Necessary for Android to show notifications in some versions
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("expiry-alerts", {
                name: "Alertas de Vencimiento",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        return true;
    }

    /**
     * Schedule a local notification for a food item.
     * Alert will be shown 1 day before the expiry date at 9:00 AM.
     * If the food is already expiring today or tomorrow, it schedules it for as soon as possible.
     */
    async scheduleExpiryNotification(food: FoodItem): Promise<void> {
        if (Platform.OS === "web") return;

        const expiryDate = new Date(food.expiryDate);
        // Set alert date to 1 day before expiry at 9:00 AM
        const alertDate = new Date(expiryDate);
        alertDate.setDate(expiryDate.getDate() - 1);
        alertDate.setHours(9, 0, 0, 0);

        // If the alert date has already passed, don't schedule it unless it's for today
        const now = new Date();
        if (alertDate < now) {
            // If it expires in the future, alert in 1 minute for items already "proximos a vencer"
            if (expiryDate > now) {
                alertDate.setTime(now.getTime() + 60 * 1000); // 1 minute from now
            } else {
                // Already expired, no notification needed here (maybe a different alert type in the future)
                return;
            }
        }

        try {
            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "¡Alimento por vencer!",
                    body: `Tu ${food.name} vencerá mañana. ¡No lo olvides!`,
                    data: { foodId: food.id },
                    sound: true,
                },
                trigger: {
                    date: alertDate,
                    channelId: "expiry-alerts",
                } as Notifications.DateTriggerInput,
                identifier: food.id, // Use food ID as notification identifier so we can cancel it easily
            });
            console.log(`Notification scheduled for ${food.name} at ${alertDate.toLocaleString()} (ID: ${identifier})`);
        } catch (error) {
            console.error(`Error scheduling notification for ${food.name}:`, error);
        }
    }

    /**
     * Cancel the scheduled notification for a food item.
     */
    async cancelExpiryNotification(foodId: string): Promise<void> {
        if (Platform.OS === "web") return;
        try {
            await Notifications.cancelScheduledNotificationAsync(foodId);
            console.log(`Notification canceled for foodId: ${foodId}`);
        } catch (error) {
            console.error(`Error canceling notification for foodId: ${foodId}:`, error);
        }
    }
}