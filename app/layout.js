import { Inter } from "next/font/google";
import "./globals.css";
import "../Components/homepage.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { SessionProvider } from "next-auth/react"
// import AppBar from "@/Components/AppBar";
import { Domine } from "next/font/google";
import { Suspense } from "react";
import { NavigationEvents } from "@/Components/NavigationEvents";


const inter = Domine({ weight:'400', subsets: ["latin"] });

export const metadata = {
  title: "Dish Discovery",
  description: "a recipe sharing app",
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProvider>
      <body className={inter.className} style={{backgroundColor:'#EEEEEE'}}>
      <Suspense fallback={null}>
        <Navbar/>
        {/* <AppBar/> */}
        {children}
        
          <NavigationEvents />
        
        <Footer suppressHydrationWarning={true}/>
        </Suspense>
      </body>
      </SessionProvider>
    </html>
  );
}
