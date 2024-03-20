"use client";
import { useQuery, gql } from "@apollo/client";
import client from "@/apolloClient";
import Link from "next/link";
import { useState } from "react";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UpdateButton from "@/Components/UpdateRecipe";
import Head from "next/head";
import { Great_Vibes } from "next/font/google";
import { SyncLoader } from "react-spinners";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Suspense } from "react";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
});

export default function dish({ params }) {
  const { data: session, status } = useSession();
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();
  const getQuery = params.dish;

  const GET_ITEM = gql`
    query GetDishes($slug: String!) {
      dishCollection(where: { slug: $slug }) {
        items {
          sys {
            id
          }
          title(locale: "en-US")
          description(locale: "en-US")
          slug
          ingredients
          preparation
          calories
          category
          email
          name
          about
          image {
            url
          }
          profilepic {
            url
          }
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_ITEM, {
    client,
    variables: { slug: getQuery },
  });
  if (loading)
    return (
      <div className="sweet-loading">
        <SyncLoader color={"#222831"} size={15} margin={5} />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;
  const { dishCollection } = data;
  const dishItem = dishCollection.items;
  if (status === "loading")
    return (
      <div className="sweet-loading">
        <SyncLoader color={"#222831"} size={15} margin={5} />
      </div>
    );

  let GetEmail = "";
  if (session) {
    GetEmail = session.user.email;
  } else {
    GetEmail = "";
  }

  if (!session) {
    router.push("/api/auth/signin");
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: window.location.href });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.log("Web Share API not supported");
      // Provide a fallback for unsupported browsers here
    }
  };

  function handleUpdateClick() {
    setLoader(true);
  }

  // const handleDownload = () => {
  //   const input = document.getElementById('content-to-download');

  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const width = pdf.internal.pageSize.getWidth();
  //     const height = pdf.internal.pageSize.getHeight();

  //     pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  //     pdf.save('download.pdf');
  //   });
  // };

  return (
    <Suspense>
      <div style={{ marginTop: "5rem", textAlign: "center" }}>
        <Head></Head>
        <ul style={{paddingLeft:'0'}}>
          {dishItem.map((cuisine) => (
            <div key={cuisine.slug}>
              <div
                style={{
                  backgroundColor: "rgb(228 233 240)",
                  marginLeft: "-30px",
                  paddingTop: "3%",
                  paddingBottom: "3%",
                }}
              >
                <center>
                  <h1 style={{ color: "#222831" }}>{cuisine.title}</h1>
                </center>
                <div className="dish-desc">
                  <p>{cuisine.description}</p>
                </div>
                {session && cuisine.email === GetEmail ? (
                  <button className="dish-icon">
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ marginRight: "4px" }}
                    />{" "}
                    <Link
                      className="edit"
                      href={`/cuisines/${cuisine.category}/${
                        cuisine.slug
                      }/update?id=${encodeURIComponent(
                        cuisine.sys.id
                      )}&slug=${encodeURIComponent(
                        cuisine.slug
                      )}&title=${encodeURIComponent(
                        cuisine.title
                      )}&description=${encodeURIComponent(
                        cuisine.description
                      )}&ingredients=${encodeURIComponent(
                        cuisine.ingredients
                      )}&preparation=${encodeURIComponent(
                        cuisine.preparation
                      )}&calories=${encodeURIComponent(
                        cuisine.calories
                      )}&category=${encodeURIComponent(
                        cuisine.category
                      )}&image=${encodeURIComponent(cuisine.image.url)}
                  &email=${encodeURIComponent(cuisine.email)}
                  &name=${encodeURIComponent(cuisine.name)}
                  &about=${encodeURIComponent(cuisine.about)}
                  &profilepic=${encodeURIComponent(cuisine.profilepic.url)}`}
                      style={{ color: "#EEEEEE" }}
                      onClick={handleUpdateClick}
                    >
                      {loader ? (
                        <SyncLoader color={"#EEEEEE"} size={5} margin={5} />
                      ) : (
                        "Update"
                      )}
                    </Link>
                  </button>
                ) : null}
                {/* <button onClick={handleDownload(cuisine.title)} className="dish-icon">
                <FontAwesomeIcon
                  icon={faDownload}
                  style={{ color: "#EEEEEE", marginRight: "4px" }}
                />
                Download
              </button> */}
                <button className="dish-icon" onClick={handleShare}>
                  <FontAwesomeIcon
                    icon={faShare}
                    style={{ color: "#EEEEEE", marginRight: "4px" }}
                  />
                  Share
                </button>
              </div>
              <br />
              <br />
              <div className="dish-out">
                <div style={{width:'50%', margin:'auto'}}>
                  <div style={{ marginBottom: "4%"}}>
                    <img
                      src={cuisine.image.url}
                      style={{
                        height: "30%",
                        maxWidth: "80%",
                        // marginLeft: "-4%",
                      }}
                      alt={cuisine.slug}
                    />
                  </div>
                  <div className="ingredients">
                    <h3
                      style={{
                        color: "#EEEEEE",
                        marginLeft: "-30px",
                        backgroundColor: "#222831",
                        paddingLeft: "40%",
                        paddingRight: "40%",
                      }}
                    >
                      Ingredients
                    </h3>
                    <p style={{ marginTop: "4%" }}>
                      <ul style={{ listStyleType: "disc", color: "grey" }}>
                        {cuisine.ingredients
                          .split("-")
                          .map(
                            (ingredient, index) =>
                              ingredient.trim() && (
                                <li key={index}>{ingredient.trim()}</li>
                              )
                          )}
                      </ul>
                    </p>
                  </div>
                  <div className="instructions">
                    <h3
                      style={{
                        color: "#EEEEEE",
                        backgroundColor: "#222831",
                        paddingLeft: "40%",
                        paddingRight: "40%",
                        marginLeft: "-30px",
                        marginTop: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      Instructions
                    </h3>
                    <p>
                      <ol style={{ color: "grey", textAlign: "left" }}>
                        {cuisine.preparation
                          .split("-")
                          .map(
                            (ingredient, index) =>
                              ingredient.trim() && (
                                <li key={index}>{ingredient.trim()}</li>
                              )
                          )}
                      </ol>
                    </p>
                  </div>
                  {/* calories */}
                  <div className="instructions">
                    <h3
                      style={{
                        color: "#EEEEEE",
                        backgroundColor: "#222831",
                        paddingLeft: "40%",
                        paddingRight: "40%",
                        marginLeft: "-30px",
                        marginTop: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      Calories
                    </h3>
                    <p>
                      <ul style={{ color: "grey", textAlign: "left", listStyleType: "disc", }}>
                        <li>{cuisine.calories} calories per 100g</li>
                      </ul>
                    </p>
                  </div>
                </div>
                <div className="abt-chef">
                  <h4 style={{ color: "#222831" }}>About the chef</h4>
                  <img
                    className="chef-img"
                    src={cuisine.profilepic.url}
                    alt={cuisine.slug}
                  />
                  <div className="chef-intro">
                    <h3 style={{ color: "#222831" }}>
                      Hi! I'm {cuisine.name}.
                    </h3>
                    <h3
                      className={greatVibes.className}
                      style={{ color: "#00ADB5" }}
                    >
                      Nice to meet you
                    </h3>
                    <p>{cuisine.about}</p>
                  </div>
                </div>
              </div>
              {/* download content */}
              {/* <div style={{ textAlign: "left" }} id="content-to-download">
                <h1>{cuisine.title}</h1>
              <br />
              <p>{cuisine.about}</p>
              <h2>Ingredients</h2>
              <ul>
                {cuisine.ingredients
                  .split("-")
                  .map(
                    (ingredient, index) =>
                      ingredient.trim() && (
                        <li key={index}>{ingredient.trim()}</li>
                      )
                  )}
              </ul><br/>
              <h2>Instructions</h2>
              <ol style={{ color: "black", textAlign: "left" }}>
                {cuisine.preparation
                  .split("-")
                  .map(
                    (ingredient, index) =>
                      ingredient.trim() && (
                        <li key={index}>{ingredient.trim()}</li>
                      )
                  )}
              </ol><br/>
              <h2>Calories</h2>
              <p>{cuisine.calories} per 100g</p>
            </div> */}
            </div>
          ))}
        </ul>
      </div>
    </Suspense>
  );
}
