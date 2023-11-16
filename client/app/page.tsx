import Link from "next/link"

export default function HomePage() {
    return (
        <main>
            <div className="">Hello world</div>
            <div className="">
                <Link href="/login">Login</Link>
            </div>
        </main>
    )
}