import { ThemedView } from "@/components/themed-view";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRepositories } from "@/application/hooks/use-repositories";
import { User } from "@/domain/auth/entities";

export default function OAuthCallback() {
  const { authRepository, authStorageRepository } = useRepositories();
  const router = useRouter();
  const params = useLocalSearchParams<{
    code?: string;
    state?: string;
    error?: string;
    sessionToken?: string;
    user?: string;
  }>();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      console.log("[OAuth] Callback handler triggered");
      try {
        // Check for sessionToken in params first (web OAuth callback from server redirect)
        if (params.sessionToken) {
          console.log("[OAuth] Session token found in params (web callback)");
          await authStorageRepository.setSessionToken(params.sessionToken);

          if (params.user) {
            try {
              const userJson =
                typeof atob !== "undefined"
                  ? atob(params.user)
                  : Buffer.from(params.user, "base64").toString("utf-8");
              const userData = JSON.parse(userJson);
              const userInfo: User = {
                ...userData,
                lastSignedIn: new Date(userData.lastSignedIn || Date.now()),
              };
              await authStorageRepository.setUserInfo(userInfo);
            } catch (err) {
              console.error("[OAuth] Failed to parse user data:", err);
            }
          }

          setStatus("success");
          setTimeout(() => {
            router.replace("/(tabs)");
          }, 1000);
          return;
        }

        let code: string | null = params.code || null;
        let state: string | null = params.state || null;
        let sessionToken: string | null = params.sessionToken || null;

        if (!code || !state) {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl) {
            const urlObj = new URL(initialUrl);
            code = code || urlObj.searchParams.get("code");
            state = state || urlObj.searchParams.get("state");
            sessionToken = sessionToken || urlObj.searchParams.get("sessionToken");
          }
        }

        if (sessionToken) {
          await authStorageRepository.setSessionToken(sessionToken);
          setStatus("success");
          setTimeout(() => {
            router.replace("/(tabs)");
          }, 1000);
          return;
        }

        if (!code || !state) {
          setStatus("error");
          setErrorMessage("Missing code or state parameter");
          return;
        }

        const result = await authRepository.exchangeOAuthCode(code, state);
        if (result.sessionToken) {
          await authStorageRepository.setSessionToken(result.sessionToken);
          if (result.user) {
            const userInfo: User = {
              ...result.user,
              lastSignedIn: new Date(result.user.lastSignedIn || Date.now()),
            };
            await authStorageRepository.setUserInfo(userInfo);
          }
          setStatus("success");
          setTimeout(() => {
            router.replace("/(tabs)");
          }, 1000);
        } else {
          setStatus("error");
          setErrorMessage("No session token received");
        }
      } catch (error) {
        console.error("[OAuth] Callback error:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to complete authentication",
        );
      }
    };

    handleCallback();
  }, [params.code, params.state, params.error, params.sessionToken, params.user, router, authRepository, authStorageRepository]);

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom", "left", "right"]}>
      <ThemedView className="flex-1 items-center justify-center gap-4 p-5">
        {status === "processing" && (
          <>
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-base leading-6 text-center text-foreground">
              Completing authentication...
            </Text>
          </>
        )}
        {status === "success" && (
          <>
            <Text className="text-base leading-6 text-center text-foreground">
              Authentication successful!
            </Text>
            <Text className="text-base leading-6 text-center text-foreground">
              Redirecting...
            </Text>
          </>
        )}
        {status === "error" && (
          <>
            <Text className="mb-2 text-xl font-bold leading-7 text-error">
              Authentication failed
            </Text>
            <Text className="text-base leading-6 text-center text-foreground">
              {errorMessage}
            </Text>
          </>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
