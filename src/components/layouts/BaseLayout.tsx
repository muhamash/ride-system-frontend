import type { IBaseLayout } from "@/types/layout.types";
import Footer from "./Footer";
import { Navbar } from './Nav';


export default function BaseLayout({children}: IBaseLayout) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="grow-1">
                {children}
            </div>

            <Footer/>
        </div>
    );
}
