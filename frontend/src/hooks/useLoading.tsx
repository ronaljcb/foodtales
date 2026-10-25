import { createContext, useContext, useState, ReactNode } from "react";
import "./styles/loading.css";

const LoadingContext = createContext<{ isLoading: boolean; setIsLoading: React.Dispatch<React.SetStateAction<boolean>> }>({
    isLoading: false,
    setIsLoading: () => { },
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    return useContext(LoadingContext);
};

export const Loading = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <section className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center">
            <div className="flex">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </section>
    );

};
