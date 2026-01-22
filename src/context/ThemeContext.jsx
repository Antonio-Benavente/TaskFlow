import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'light'
        
        const savedTheme = localStorage.getItem("taskflow-theme")
        if (savedTheme === "light" || savedTheme === "dark") {
            return savedTheme
        }
        
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        return systemDark ? "dark" : "light"
    })

    const [hasUserPreference, setHasUserPreference] = useState(() => {
        if (typeof window === 'undefined') return false
        return localStorage.getItem("taskflow-theme") !== null
    })

    useEffect(() => {
        if (hasUserPreference) return

        const media = window.matchMedia("(prefers-color-scheme: dark)")

        const handler = (e) => {
            setTheme(e.matches ? "dark" : "light")
        }

        media.addEventListener("change", handler)
        return () => media.removeEventListener("change", handler)
    }, [hasUserPreference])

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        
        if (hasUserPreference) {
            localStorage.setItem("taskflow-theme", theme)
        }
    }, [theme, hasUserPreference])

    const toggleTheme = () => {
        setHasUserPreference(true)
        setTheme(prev => (prev === "light" ? "dark" : "light"))
    }

    const resetTheme = () => {
        localStorage.removeItem("taskflow-theme")
        setHasUserPreference(false)
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setTheme(systemDark ? "dark" : "light")
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, resetTheme, hasUserPreference }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme debe ser usado dentro de ThemeProvider")
    }
    return context
}