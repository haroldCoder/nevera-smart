import { useContext } from "react";
import { DependencyContext } from "@/application/context/dependency-context";

export const useRepositories = () => {
    const context = useContext(DependencyContext);
    if (!context) {
        throw new Error("useRepositories must be used within a DependencyProvider");
    }
    return context;
};