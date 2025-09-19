import 'bootstrap/dist/css/bootstrap.min.css'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "../public/backgroundHome.jpg"



export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <Meta />
        <Links />
      </head>
      <body>

        <main className="bg-image img-fluid" style={{
          backgroundImage: `url('../public/backgroundHome.jpg?url')`,
          height: "100vh",
          marginTop: "0px",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          fontFamily: "roboto"
        }}>
        
          <Outlet />
        
        </main>


        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}