import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-zinc-900 text-zinc-200 p-4 fixed top-0 left-0 w-full z-50">
            <h1 className="text-3xl font-bold text-center">Fellowship - Find Your premade faster</h1>
            <div className="flex w-screen justify-evenly pt-4">
                <Link href='/'><button className="bg-sky-200 hover:bg-sky-500 py-4 px-10 rounded-full hover:cursor-pointer text-black">Find premade</button></Link>
                <Link href='/createAdd'><button className="bg-sky-200 hover:bg-sky-500 py-4 px-10 rounded-full hover:cursor-pointer text-black">Create add</button></Link>
            </div>
        </header>
    );
}