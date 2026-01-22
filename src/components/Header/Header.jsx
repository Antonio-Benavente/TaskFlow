import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import styles from "./Header.module.css"
import { useTheme } from "../../context/ThemeContext"
import { useBoards } from "../../context/BoardsContext"
import { UserMenu } from "../UserMenu/UserMenu.jsx"

export function Header() {
    const { theme, toggleTheme } = useTheme()
    const { boardId } = useParams()
    const { boards } = useBoards()

    const [board, setBoard] = useState(null)

    useEffect(() => {
        if (!boardId) {
            setBoard(null)
            return
        }

        const found = boards.find(b => b.id === boardId)
        setBoard(found || null)
    }, [boardId, boards])

    return (
        <header className={styles.header}>
            <div className={styles.containerLeft}>
                <div className={styles.logo}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#2F6BFF" d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/></svg>
                    <h2>TaskFlow</h2>
                </div>

                <span className={styles.separator}>/</span>

                <nav className={styles.breadcrumb}>
                    <Link to="/boards">Mis tableros</Link>
                    {board && <span>{board.title}</span>}
                </nav>
            </div>

            <div className={styles.containerRight}>
                <button className={styles.theme} onClick={toggleTheme}>
                    {theme === "light"
                        ? <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-moon"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-sun-high"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656z" /><path d="M6.343 17.657l-1.414 1.414" /><path d="M6.343 6.343l-1.414 -1.414" /><path d="M17.657 6.343l1.414 -1.414" /><path d="M17.657 17.657l1.414 1.414" /><path d="M4 12h-2" /><path d="M12 4v-2" /><path d="M20 12h2" /><path d="M12 20v2" /></svg>}


                </button>
                <UserMenu />
            </div>
        </header>
    )
}