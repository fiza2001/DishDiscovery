"use client";
import { useState, useEffect, useRef } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useSearchParams } from "next/navigation";
import { SyncLoader } from "react-spinners";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const [showList, setShowList] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}?${searchParams}`;
  console.log(url);

  const isActive = (route) => {
    return url === route ? "active" : "";
  };

  const items = [
    "Indian",
    "Mexican",
    "American",
    "Italian",
    "French",
    "Chinese",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (elementRef.current && !elementRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDetails = () => {
    setShowDetails((prevShowDetails) => !prevShowDetails);
  };

  const toggleList = () => {
    setShowList(!showList);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = items.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
    setIsVisible(true);
  };

  return (
    <Suspense
      fallback={
        <div className="sweet-loading">
          <SyncLoader color={"#222831"} size={15} margin={5} />
        </div>
      }
    >
      <div className="nav-main">
        <div>
          <Link
            href="/"
            style={{
              color: "#EEEEEE",
              fontSize: "24px",
              textDecoration: "none",
            }}
            className="nav-title"
          >
            Dish Discovery
          </Link>
        </div>
        {/* <search */}
        <div>
          <div className="wrap">
            <div className="search">
              <input
                type="text"
                className="searchTerm"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by cuisine"
              />
              <button type="submit" className="searchButton">
                <FontAwesomeIcon icon={faSearch} size="sm" color="white" />
              </button>
            </div>
          </div>
          {isVisible && (
            <ul ref={elementRef} className="search-list" id="element-to-hide">
              {searchQuery &&
                (filteredItems.length === 0 ? (
                  <li>No results found</li>
                ) : (
                  <>
                    {filteredItems.map((item, index) => (
                      <Link
                        style={{ textDecoration: "none", color: "#393E46" }}
                        key={index}
                        href={`/cuisines/${item.toLowerCase()}`}
                      >
                        <li>{item}</li>
                      </Link>
                    ))}
                  </>
                ))}
            </ul>
          )}
        </div>
        <div className="nav-ul-div">
          <ul className="nav-ul-links">
            <li style={{ paddingTop: "15px" }} id="home-id">
              <Link
                className={isActive("/?")}
                href="/"
                style={{ textDecoration: "none", color: "#EEEEEE" }}
              >
                HOME
              </Link>
            </li>
            <li style={{ paddingTop: "15px" }} id="about-id">
              <Link
                className={isActive("/about?")}
                href="/about"
                style={{ textDecoration: "none", color: "#EEEEEE" }}
              >
                ABOUT
              </Link>
            </li>
            <li style={{ paddingTop: "15px" }} id="cuisines-id">
              <Link
                className={isActive("/cuisines?")}
                href="/cuisines"
                style={{ textDecoration: "none", color: "#EEEEEE" }}
              >
                CUISINES
              </Link>
            </li>
            <li style={{ paddingTop: "15px" }} id="create-id">
              <Link
                className={isActive("/create?")}
                href="/create"
                style={{ textDecoration: "none", color: "#EEEEEE" }}
              >
                CREATE RECIPE
              </Link>
            </li>
            <li style={{ paddingTop: "15px" }} id="myrecipe-id">
              <Link
                className={isActive("/myrecipe?")}
                href="/myrecipe"
                style={{ textDecoration: "none", color: "#EEEEEE" }}
              >
                MY RECIPE
              </Link>
            </li>
            <li>
              {session && session.user.name && session.user.image ? (
                <ul className="nav-session">
                  <div className="user-profile" style={{ marginTop: "15%" }}>
                    <div className="profile-image" onClick={toggleDetails}>
                      <img src={session.user.image} alt={session.user.name} />
                    </div>
                    {showDetails && (
                      <div
                        className="profile-details"
                        style={{ display: showDetails ? "block" : "none" }}
                      >
                        <p
                          style={{
                            textAlign: "center",
                            paddingBottom: "10px",
                            color: "#393E46",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            style={{ paddingRight: "10px" }}
                          />
                          {session.user.name}
                        </p>
                        <Link className="signout-btn" href="/api/auth/signout">
                          Sign Out
                        </Link>
                      </div>
                    )}
                  </div>
                </ul>
              ) : (
                <div style={{ marginTop: "15%" }}>
                  <Link
                    href="/api/auth/signin"
                    style={{
                      textDecoration: "none",
                      color: "#EEEEEE",
                      border: "1px solid white",
                      padding: "10px 15px 10px 15px",
                      fontWeight: "bold",
                    }}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
        <div className="bars-icon" onClick={toggleList}>
          {showList ? (
            <FontAwesomeIcon
              icon={faClose}
              className="bars"
              style={{ color: "#EEEEEE", fontSize: "30px" }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faBars}
              className="close"
              style={{ color: "#EEEEEE", fontSize: "30px" }}
            />
          )}
        </div>
      </div>
      {showList ? (
        <div className="bars-menu">
          <ul style={{ listStyleType: "none" }}>
            <Link
              href="/"
              style={{
                color: "#EEEEEE",
                textDecoration: "none",
                textAlign: "center",
                paddingBottom: "10px",
              }}
            >
              <li className={isActive("/?")}>HOME</li>
            </Link>
            <Link
              href="/about"
              style={{
                color: "#EEEEEE",
                textDecoration: "none",
                textAlign: "center",
                paddingBottom: "10px",
              }}
            >
              <li className={isActive("/about?")}>ABOUT</li>
            </Link>
            <Link
              href="/cuisines"
              style={{
                color: "#EEEEEE",
                textDecoration: "none",
                textAlign: "center",
                paddingBottom: "10px",
              }}
            >
              <li className={isActive("/cuisines?")}>CUISINES</li>
            </Link>
            <Link
              href="/create"
              style={{
                color: "#EEEEEE",
                textDecoration: "none",
                textAlign: "center",
                paddingBottom: "10px",
              }}
            >
              <li className={isActive("/create?")}>CREATE RECIPE</li>
            </Link>
            <Link
              href="/myrecipe"
              style={{
                color: "#EEEEEE",
                textDecoration: "none",
                textAlign: "center",
                paddingBottom: "10px",
              }}
            >
              <li className={isActive("/myrecipe?")}>MY RECIPE</li>
            </Link>
            <li className="auth-li">
              {session && session.user.name && session.user.image ? (
                <ul className="nav-session">
                  <div className="user-profile">
                    <div className="profile-image" onClick={toggleDetails}>
                      <img src={session.user.image} alt={session.user.name} />
                    </div>
                    {showDetails && (
                      <div
                        className="profile-details"
                        style={{
                          display: showDetails ? "block" : "none",
                          color: "black",
                        }}
                      >
                        <p style={{ marginBottom: "15px", color: "#222831" }}>
                          <FontAwesomeIcon
                            icon={faUser}
                            style={{ paddingRight: "10px" }}
                          />
                          {session.user.name}
                        </p>
                        <Link className="signout-btn" href="/api/auth/signout">
                          Sign Out
                        </Link>
                      </div>
                    )}
                  </div>
                </ul>
              ) : (
                <div style={{ marginTop: "7%" }}>
                  <Link
                    href="/api/auth/signin"
                    style={{
                      textDecoration: "none",
                      color: "#EEEEEE",
                      border: "1px solid white",
                      padding: "10px 15px 10px 15px",
                      fontWeight: "bold",
                    }}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      ) : null}
    </Suspense>
  );
}

// import { useState } from "react";
// import Link from "next/link";
// import { useSession } from "next-auth/react";

// export default function Navbar() {
//   const [showList, setShowList] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
//   const { data: session, status } = useSession();

//   const toggleDetails = () => {
//     setShowDetails(!showDetails);
//   };
//   return (
//     <div className="nav-main">
//       <div>
//         <h2>Logo</h2>
//       </div>
//       <div>
//         <ul className="nav-ul-links">
//           <li>HOME</li>
//           <li>ABOUT</li>
//           <li>CUISINES</li>
//           <li>CREATE RECIPE</li>
//           <li>MY RECIPE</li>
//         </ul>
//       </div>
//       <div>
//         <ul className="nav-session">
//           <li>
//             {session && session.user.name && session.user.image ? (
//               <div className="user-profile">
//                 <div className="profile-image" onClick={toggleDetails}>
//                   <img src={session.user.image} alt={session.user.name} />
//                 </div>
//                 {showDetails && (
//                   <div className="profile-details">
//                     <p>{session.user.name}</p>
//                     <Link style={{ color: "black" }} href="/api/auth/signout">
//                       Sign Out
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link href="/api/auth/signin">Sign In</Link>
//             )}
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// // import "./homepage.css";
// import "./navbar.css"
// import AppBar from "./AppBar";
// import { useSession } from "next-auth/react";

// export default function Navbar() {
//   const [showList, setShowList] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
//   const { data: session, status } = useSession();

//   const toggleList = () => {
//     setShowList(!showList);
//   };

//   const toggleDetails = () => {
//     setShowDetails(!showDetails);
//   };

//   return (
//     <div className="nav-main">
//       <nav className="nav">
//         <div className="container">
//           <div className="logo">
//             <Link href="/">Dish Discovery</Link>
//           </div>
//           <div
//             className={`main_list ${showList ? "show_list" : ""}`}
//             id="mainListDiv"
//            >
//             <ul>
//               <li>
//                 <Link href="/">Home</Link>
//               </li>
//               <li>
//                 <Link href="/about">About</Link>
//               </li>
//               <li>
//                 <Link href="/cuisines">Cuisines</Link>
//               </li>
//               <li>
//                 <Link href="/create">Create Recipe</Link>
//               </li>
//               <li>
//                 <Link href="/myrecipe">My Recipe's</Link>
//               </li>
//               <li>
//                 {session && session.user.name && session.user.image ? (
//                   <div className="user-profile">
//                     <div className="profile-image" onClick={toggleDetails}>
//                       <img src={session.user.image} alt={session.user.name} />
//                     </div>
//                     {showDetails && (
//                       <div className="profile-details">
//                         <p>{session.user.name}</p>
//                         <Link style={{color:'black'}} href="/api/auth/signout">Sign Out</Link>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <Link href="/api/auth/signin">Sign In</Link>
//                 )}
//               </li>
//             </ul>
//           </div>
//           <div className="media_button">
//             <button
//               className={`main_media_button ${showList ? "active" : ""}`}
//               onClick={toggleList}
//             >
//               <span></span>
//               <span></span>
//               <span></span>
//             </button>
//           </div>
//         </div>
//       </nav>
//       <br />
//     </div>
//   );
// }
