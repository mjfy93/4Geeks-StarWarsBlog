import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Link, Meta, Links, Outlet, ScrollRestoration, Scripts, useLoaderData, useParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faJedi } from "@fortawesome/free-solid-svg-icons";
import { createContext, useContext, useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const FavoritesContext = createContext();
const STORAGE_KEY = "starwars-favorites";
function FavoritesProvider({ children }) {
  const [favorites2, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedFavorites = localStorage.getItem(STORAGE_KEY);
        return savedFavorites ? JSON.parse(savedFavorites) : [];
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error);
        return [];
      }
    }
    return [];
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites2));
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    }
  }, [favorites2]);
  const addFavorite = (item) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === item.id && fav.category === item.category)) {
        return prev;
      }
      return [...prev, item];
    });
  };
  const removeFavorite = (itemId, category) => {
    setFavorites((prev) => prev.filter((fav) => !(fav.id === itemId && fav.category === category)));
  };
  const isFavorite = (itemId, category) => {
    return favorites2.some((fav) => fav.id === itemId && fav.category === category);
  };
  const getFavoritesByCategory = (category) => {
    return favorites2.filter((fav) => fav.category === category);
  };
  const clearAllFavorites = () => {
    setFavorites([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };
  return /* @__PURE__ */ jsx(FavoritesContext.Provider, { value: {
    favorites: favorites2,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoritesByCategory,
    clearAllFavorites
  }, children });
}
function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
const favorites = UNSAFE_withComponentProps(function Favorites() {
  const {
    favorites: favorites2,
    removeFavorite
  } = useFavorites();
  if (favorites2.length === 0) {
    return /* @__PURE__ */ jsxs("div", {
      className: "faveContainer",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "faveHeader",
        children: "Your Favorites"
      }), /* @__PURE__ */ jsx("p", {
        children: "No favorites yet! Start exploring to add some."
      }), /* @__PURE__ */ jsx(Link, {
        to: "/",
        className: "linkBack",
        children: "← Back to Home"
      })]
    });
  }
  const groupedFavorites = favorites2.reduce((acc, fav) => {
    if (!acc[fav.category]) acc[fav.category] = [];
    acc[fav.category].push(fav);
    return acc;
  }, {});
  return /* @__PURE__ */ jsx("div", {
    className: "faveContainer",
    children: /* @__PURE__ */ jsx("div", {
      className: "faveCategories",
      children: Object.entries(groupedFavorites).map(([category, items]) => /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h2", {
          className: "faveHeader",
          children: category.charAt(0).toUpperCase() + category.slice(1)
        }), items.map((item) => /* @__PURE__ */ jsxs("div", {
          className: "favorites",
          children: [/* @__PURE__ */ jsx(Link, {
            to: `/${item.category}/${item.id}`,
            children: item.name
          }), /* @__PURE__ */ jsx("button", {
            className: "removeFaveButton",
            onClick: () => removeFavorite(item.id, item.category),
            children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
              icon: faTrash
            })
          })]
        }, `${item.category}-${item.id}`))]
      }, category))
    })
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: favorites
}, Symbol.toStringTag, { value: "Module" }));
function Navbar() {
  return /* @__PURE__ */ jsxs("nav", { children: [
    /* @__PURE__ */ jsx(Link, { to: "/", id: "homeLink", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faJedi, id: "jediIcon" }) }),
    /* @__PURE__ */ jsx(Link, { to: "/favorites", id: "favoritesLink", children: "Your Favorites" })
  ] });
}
function links() {
  return [{
    rel: "stylesheet",
    href: "/app/styles/stylesHome.css"
  }, {
    rel: "stylesheet",
    href: "/app/styles/stylesCategories.css"
  }, {
    rel: "stylesheet",
    href: "/app/styles/stylesFavorites.css"
  }, {
    rel: "stylesheet",
    href: "/app/styles/stylesSubcategories.css"
  }];
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "UTF-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsxs(FavoritesProvider, {
        children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsx(Outlet, {})]
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2() {
  const response = await fetch("https://swapi.tech/api");
  return response.json();
}
const _index = UNSAFE_withComponentProps(function Home() {
  const data = useLoaderData();
  const images = ["https://i.pinimg.com/736x/10/c6/ad/10c6add44b13d13bcaf326cd5c286818.jpg", "https://www.comicbasics.com/wp-content/uploads/2023/07/most-important-star-wars-planets.jpg", "https://geekculture.co/wp-content/uploads/2015/11/alongtimeago.jpg"];
  const descriptions2 = ["Meet the amazing characters that have made millions of people, from all walks of life, fall in love with this amazing world.", "From frozen worlds, to infinite desserts, explore all your favorite planets and immerse yourself in this vast galaxy.", "The iconic Millennium Falcon and the infamous Death Star are only the beginning, there are so many other vehicles to discover."];
  const categoriesInfo = Object.entries(data.result).filter(([category, url]) => url.includes("people") || url.includes("planets") || url.includes("vehicles"));
  return /* @__PURE__ */ jsxs("div", {
    className: "containerHome",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "header",
      children: "STAR WARS Blog - Get to know a Galaxy Far, Far Away"
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("p", {
        children: "STAR WARS fans, famously some of the most dedicated and passionate fans in the world, know that this is a diverse and complex universe. Save your favorites for later! "
      }), /* @__PURE__ */ jsx("div", {
        className: "categoriesHome",
        children: categoriesInfo.map(([category, url], index) => /* @__PURE__ */ jsxs("div", {
          className: "cardHome",
          children: [/* @__PURE__ */ jsx("img", {
            src: images[index],
            className: "imageHome"
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("p", {
              className: "descriptionsHome",
              children: descriptions2[index]
            }), /* @__PURE__ */ jsx("button", {
              className: "buttonHome",
              children: /* @__PURE__ */ jsxs(Link, {
                to: `/${category}`,
                className: "buttonHome",
                children: ["Discover the ", category.charAt(0).toUpperCase() + category.slice(1)]
              }, index)
            })]
          })]
        }, index))
      })]
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const imageUrls = {
  people: {
    "Luke Skywalker": "https://lumiere-a.akamaihd.net/v1/images/luke-skywalker-main_7ffe21c7.jpeg?region=130%2C147%2C1417%2C796",
    "C-3PO": "https://lumiere-a.akamaihd.net/v1/images/c-3po-main_d6850e28.jpeg?region=176%2C0%2C951%2C536",
    "R2-D2": "https://lumiere-a.akamaihd.net/v1/images/r2-d2-main_f315b094.jpeg?region=273%2C0%2C951%2C536",
    "Darth Vader": "https://lumiere-a.akamaihd.net/v1/images/darth-vader-main_4560aff7.jpeg?region=0%2C67%2C1280%2C720",
    "Leia Organa": "https://lumiere-a.akamaihd.net/v1/images/leia-organa-main_9af6ff81.jpeg?region=187%2C157%2C1400%2C786",
    "Owen Lars": "https://lumiere-a.akamaihd.net/v1/images/owen-lars-main_08c717c8.jpeg?region=0%2C34%2C1053%2C593",
    "Beru Whitesun lars": "https://lumiere-a.akamaihd.net/v1/images/beru-lars-main_fa680a4c.png?region=342%2C0%2C938%2C527",
    "R5-D4": "https://lumiere-a.akamaihd.net/v1/images/r5-d4_main_image_7d5f078e.jpeg?region=374%2C0%2C1186%2C666",
    "Biggs Darklighter": "https://lumiere-a.akamaihd.net/v1/images/image_606ff7f7.jpeg?region=0%2C0%2C1560%2C878",
    "Obi-Wan Kenobi": "https://lumiere-a.akamaihd.net/v1/images/obi-wan-kenobi-main_3286c63c.jpeg?region=0%2C0%2C1280%2C721"
  },
  planets: {
    "Tatooine": "https://lumiere-a.akamaihd.net/v1/images/tatooine-main_9542b896.jpeg?region=165%2C0%2C949%2C534",
    "Alderaan": "https://lumiere-a.akamaihd.net/v1/images/alderaan-main_f5b676cf.jpeg?region=0%2C0%2C1280%2C720",
    "Yavin IV": "https://lumiere-a.akamaihd.net/v1/images/yavin-4-main_bd23f447.jpeg?region=331%2C0%2C949%2C534g",
    "Hoth": "https://lumiere-a.akamaihd.net/v1/images/Hoth_d074d307.jpeg?region=0%2C0%2C1200%2C675",
    "Dagobah": "https://lumiere-a.akamaihd.net/v1/images/Dagobah_890df592.jpeg?region=0%2C80%2C1260%2C711",
    "Bespin": "https://lumiere-a.akamaihd.net/v1/images/Bespin_2d0759aa.jpeg?region=0%2C0%2C1560%2C878",
    "Endor": "https://lumiere-a.akamaihd.net/v1/images/databank_endor_01_169_68ba9bdc.jpeg?region=0%2C0%2C1560%2C878",
    "Naboo": "https://lumiere-a.akamaihd.net/v1/images/databank_naboo_01_169_6cd7e1e0.jpeg?region=0%2C0%2C1560%2C878",
    "Coruscant": "https://lumiere-a.akamaihd.net/v1/images/coruscant-main_d2fad5f2.jpeg?region=245%2C0%2C1430%2C804",
    "Kamino": "https://lumiere-a.akamaihd.net/v1/images/kamino-main_3001369e.jpeg?region=158%2C0%2C964%2C542"
  },
  vehicles: {
    "Sand Crawler": "https://lumiere-a.akamaihd.net/v1/images/sandcrawler-main_eb1b036b.jpeg?region=251%2C20%2C865%2C487",
    "T-16 skyhopper": "https://lumiere-a.akamaihd.net/v1/images/t-16-skyhopper-model-main_627b6185.jpeg?region=0%2C7%2C818%2C460",
    "X-34 landspeeder": "https://lumiere-a.akamaihd.net/v1/images/E4D_IA_1136_6b8704fa.jpeg?region=237%2C0%2C1456%2C819",
    "TIE/LN starfighter": "https://lumiere-a.akamaihd.net/v1/images/TIE-Fighter_25397c64.jpeg?region=0%2C1%2C2048%2C1152",
    "Snowspeeder": "https://lumiere-a.akamaihd.net/v1/images/snowspeeder_ef2f9334.jpeg?region=0%2C211%2C2048%2C1154",
    "TIE bomber": "https://lumiere-a.akamaihd.net/v1/images/tie-bomber-main_d4d9b979.jpeg?region=424%2C0%2C632%2C356",
    "AT-AT": "https://lumiere-a.akamaihd.net/v1/images/tlj-db-first-order-at-at-walker-main-image_2cd57eb2.jpeg?region=0%2C0%2C768%2C432",
    "AT-ST": "https://lumiere-a.akamaihd.net/v1/images/tlj-first-order-atst_dd236e34.jpeg?region=0%2C0%2C1560%2C878",
    "Storm IV Twin-Pod cloud car": "https://lumiere-a.akamaihd.net/v1/images/cloud-car-main-image_8d2e4e89.jpeg?region=271%2C0%2C1009%2C568",
    "Sail barge": "https://lumiere-a.akamaihd.net/v1/images/open-uri20150608-27674-168ubjg_976dbf1d.jpeg?region=0%2C0%2C1200%2C506"
  }
};
async function loader$1({
  params
}) {
  const category = params.category;
  const response = await fetch(`https://swapi.tech/api/${category}`);
  const data = await response.json();
  return {
    category,
    items: data.results
  };
}
const $category = UNSAFE_withComponentProps(function Category() {
  const {
    category,
    items
  } = useLoaderData();
  const params = useParams();
  const {
    addFavorite,
    removeFavorite,
    isFavorite
  } = useFavorites();
  const handleFavoriteToggle = (item, itemId) => {
    const favoriteItem = {
      id: itemId,
      category,
      name: item.name,
      url: item.url
    };
    if (isFavorite(itemId, category)) {
      removeFavorite(itemId, category);
    } else {
      addFavorite(favoriteItem);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    id: "containerCategories",
    children: [/* @__PURE__ */ jsxs("h1", {
      children: ["Your Favorite ", category.charAt(0).toUpperCase() + category.slice(1)]
    }), /* @__PURE__ */ jsx("div", {
      className: "cardContainer",
      children: items.map((item, index) => {
        const itemId = item.url.split("/")?.pop();
        const imageUrl = imageUrls[params.category][item.name];
        const isItemFavorite = isFavorite(itemId, category);
        return /* @__PURE__ */ jsxs("div", {
          className: "card",
          children: [/* @__PURE__ */ jsx("button", {
            className: "cardButton buttonFavorite",
            onClick: () => handleFavoriteToggle(item, itemId),
            children: isItemFavorite ? "★" : "☆"
          }), /* @__PURE__ */ jsx(Link, {
            className: "cardCategories",
            to: `/${category}/${itemId}`,
            style: {
              backgroundImage: `url(${imageUrl})`
            },
            children: /* @__PURE__ */ jsx("button", {
              className: "cardButton buttonName",
              children: item.name.split(" ").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join(" ")
            })
          }, index)]
        });
      })
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $category,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const descriptions = {
  people: {
    "Luke Skywalker": "Luke Skywalker was a Tatooine farmboy who rose from humble beginnings to become one of the greatest Jedi the galaxy has ever known.",
    "C-3PO": "C-3PO longs for more peaceful times, but his continued service to the Resistance — and his knowledge of more than seven million forms of communication — keeps the worry-prone droid in the frontlines of galactic conflict.",
    "R2-D2": "A reliable and versatile astromech droid, R2-D2 has served Padmé Amidala, Anakin Skywalker, and Luke Skywalker in turn, showing great bravery in rescuing his masters and their friends from many perils.",
    "Darth Vader": "Once the heroic Jedi Knight named Anakin Skywalker, Darth Vader was seduced by the dark side of the Force.",
    "Leia Organa": "Princess Leia Organa was one of the greatest leaders of the Rebel Alliance, fearless on the battlefield and dedicated to ending the Empire’s tyranny.",
    "Owen Lars": "Owen Lars continued his father Cliegg’s efforts to build his homestead into a productive farm, working alongside his wife, Beru. ",
    "Beru Whitesun lars": "In her youth, Beru Whitesun's aspirations did not reach beyond Tatooine. The shy young woman was content to marry Owen Lars and lead the tough life of a moisture farmer.",
    "R5-D4": "A red astromech droid, R5- D4 thought he'd found a home when the Jawas sold him to Owen Lars, along with the protocol droid C-3PO.",
    "Biggs Darklighter": "Biggs Darklighter grew up on Tatooine with Luke Skywalker, and shared his friend's dreams of escaping the dull desert world.",
    "Obi-Wan Kenobi": "A legendary Jedi Master, Obi-Wan Kenobi was a noble man and gifted in the ways of the Force."
  },
  planets: {
    "Tatooine": "Tatooine is harsh desert world orbiting twin suns in the galaxy’s Outer Rim.",
    "Alderaan": "If ever one needed an example of the irredeemable evil of the Empire, look no further than the shattered remains of Alderaan.",
    "Yavin IV": "One of a number of moons orbiting the gas giant Yavin in the galaxy’s Outer Rim, Yavin 4 is a steamy world covered in jungle and forest.",
    "Hoth": "Hoth is the sixth planet in the remote system of the same name, and was the site of the Rebel Alliance's Echo Base.",
    "Dagobah": "Home to Yoda during his final years, Dagobah was a swamp-covered planet strong with the Force -- a forgotten world where the wizened Jedi Master could escape the notice of Imperial forces.",
    "Bespin": "Secluded from galactic turmoil by its location in a little-visited sector of space, Bespin is an astrophysical rarity.",
    "Endor": "Secluded in a remote corner of the galaxy, the forest moon of Endor would easily have been overlooked by history were it not for the decisive battle that occurred there.",
    "Naboo": "An idyllic world close to the border of the Outer Rim Territories, Naboo is inhabited by peaceful humans known as the Naboo, and an indigenous species of intelligent amphibians called the Gungans.",
    "Coruscant": "Coruscant is the vibrant heart and capital of the galaxy during the age of the Empire, featuring a diverse mix of cultures and citizens spread over hundreds of levels.",
    "Kamino": "Once purged from the otherwise complete Jedi Archives was all evidence of the mysterious world of Kamino."
  },
  vehicles: {
    "Sand Crawler": "Sandcrawlers are huge treaded fortresses used by Jawas as transportation and shelter.",
    "T-16 skyhopper": "A high-performance airspeeder capable of reaching a planet’s troposphere, T-16 skyhoppers were fast and maneuverable – a combination that could be dangerous for young pilots.",
    "X-34 landspeeder": "Luke Skywalker owned one of these nondescript but speedy landspeeders, racing the sand-pocked and sun-faded craft across the desert between the Lars homestead and outposts such as Tosche Station and Anchorhead.",
    "TIE/LN starfighter": "The TIE fighter was the unforgettable symbol of the Imperial fleet.",
    "Snowspeeder": "When stationed on Hoth, the Rebel Alliance modified T-47 airspeeders to become snowspeeders, fast flying conveyances for patrol and defense of their hidden base.",
    "TIE bomber": "The Empire uses flights of its specialized double-hulled TIE bombers to drop vast quantities of munitions on rebellious planets and targets in space.",
    "AT-AT": "The All Terrain Armored Transport, or AT-AT walker, is a four-legged transport and combat vehicle used by the Imperial ground forces.",
    "AT-ST": "While not as imposing as its larger AT- AT walker cousin, the AT-ST nonetheless served as a significant addition to the Imperial side of battlefields in the Galactic Civil War.",
    "Storm IV Twin-Pod cloud car": "Cloud cars feature twin “pods” connected by a repulsorlift engine, and are equipped with light blaster cannons.",
    "Sail barge": "Jabba the Hutt valued money and power, and enjoyed showing off just how much he had of both. The Khetanna, his luxury sail barge, was among the crimelord’s most extravagant purchases."
  }
};
async function loader({
  params
}) {
  const category = params.category;
  const item = params.subcategory;
  console.log(item);
  const response = await fetch(`https://swapi.tech/api/${category}/${item}`);
  const data = await response.json();
  return data.result.properties;
}
const $category_$subcategory = UNSAFE_withComponentProps(function Subcategory() {
  const loaderData = useLoaderData();
  const params = useParams();
  const imageUrl = imageUrls[params.category][loaderData.name];
  const description = descriptions[params.category][loaderData.name];
  const dataArray = Object.entries(loaderData).filter(([key]) => !["created", "edited", "films", "starships", "url", "vehicles", "homeworld", "pilots"].includes(key));
  const {
    addFavorite,
    removeFavorite,
    isFavorite
  } = useFavorites();
  const isItemFavorite = isFavorite(params.subcategory, params.category);
  const handleFavoriteToggle = () => {
    const favoriteItem = {
      id: params.subcategory,
      category: params.category,
      name: loaderData.name,
      url: `https://swapi.tech/api/${params.category}/${params.subcategory}`
    };
    if (isItemFavorite) {
      removeFavorite(params.subcategory, params.category);
    } else {
      addFavorite(favoriteItem);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "itemContainer",
    children: [/* @__PURE__ */ jsxs(Link, {
      to: `/${params.category}`,
      className: "linkBack",
      children: ["← Back to ", params.category.charAt(0).toUpperCase() + params.category.slice(1)]
    }), /* @__PURE__ */ jsxs("h1", {
      children: [loaderData.name, /* @__PURE__ */ jsx("button", {
        className: "buttonToggleFavorite",
        onClick: handleFavoriteToggle,
        children: isItemFavorite ? "★" : "☆"
      })]
    }), /* @__PURE__ */ jsx("img", {
      src: imageUrl,
      alt: loaderData.name,
      className: "imageItem"
    }), /* @__PURE__ */ jsx("table", {
      className: "tableInfo",
      children: /* @__PURE__ */ jsx("tbody", {
        children: dataArray.map(([property, info], index) => /* @__PURE__ */ jsxs("tr", {
          children: [/* @__PURE__ */ jsx("td", {
            className: "property",
            children: /* @__PURE__ */ jsx("strong", {
              children: property.charAt(0).toUpperCase() + property.slice(1).split("_").join(" ") + ": "
            })
          }), /* @__PURE__ */ jsx("td", {
            className: "information",
            children: info.charAt(0).toUpperCase() + info.slice(1)
          })]
        }, index))
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "description",
      children: /* @__PURE__ */ jsx("p", {
        children: description
      })
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $category_$subcategory,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BfMkg4vN.js", "imports": ["/assets/chunk-PVWAREVJ-BSVouIsb.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-BJ13BkVX.js", "imports": ["/assets/chunk-PVWAREVJ-BSVouIsb.js", "/assets/index-Dd9YxV5j.js", "/assets/FavoritesContext-xm4SM-0Y.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": "/", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-YCOoFzvw.js", "imports": ["/assets/chunk-PVWAREVJ-BSVouIsb.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/favorites": { "id": "routes/favorites", "parentId": "root", "path": "/favorites", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/favorites-B6kfe_5g.js", "imports": ["/assets/chunk-PVWAREVJ-BSVouIsb.js", "/assets/FavoritesContext-xm4SM-0Y.js", "/assets/index-Dd9YxV5j.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/$category": { "id": "routes/$category", "parentId": "root", "path": "/:category", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_category-DoUzNFwY.js", "imports": ["/assets/chunk-PVWAREVJ-BSVouIsb.js", "/assets/images-DQzlemh-.js", "/assets/FavoritesContext-xm4SM-0Y.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/$category.$subcategory": { "id": "routes/$category.$subcategory", "parentId": "root", "path": "/:category/:subcategory", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_category._subcategory-DAiq6FJ9.js", "imports": ["/assets/chunk-PVWAREVJ-BSVouIsb.js", "/assets/images-DQzlemh-.js", "/assets/FavoritesContext-xm4SM-0Y.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-d041b6d0.js", "version": "d041b6d0", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: "/",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/favorites": {
    id: "routes/favorites",
    parentId: "root",
    path: "/favorites",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/$category": {
    id: "routes/$category",
    parentId: "root",
    path: "/:category",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/$category.$subcategory": {
    id: "routes/$category.$subcategory",
    parentId: "root",
    path: "/:category/:subcategory",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
