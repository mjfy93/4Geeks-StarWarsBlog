
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

export function links() {
  return [
    { rel: "stylesheet", href: "/app/styles/stylesHome.css" },
    { rel: "stylesheet", href: "/app/styles/stylesCategories.css" },
    { rel: "stylesheet", href: "/app/styles/stylesSubcategories.css" }
  ];
}



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

        
          <Navbar/>
        
          <Outlet />
        
      

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}