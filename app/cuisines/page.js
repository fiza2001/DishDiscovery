"use client";
import { useQuery, gql } from "@apollo/client";
import client from "@/apolloClient";
import Link from "next/link";
import { SyncLoader } from "react-spinners";
import { Suspense } from "react";

const GET_CUISINES = gql`
  query {
    cuisineCollection {
      items {
        name
        slug
        image {
          url
        }
      }
    }
  }
`;

export default function Cuisines() {
  const { loading, error, data } = useQuery(GET_CUISINES, { client });

  if (loading)
    return (
      <Suspense>
        <div className="sweet-loading">
          <SyncLoader color={"#222831"} size={15} margin={5} />
        </div>
      </Suspense>
    );
  if (error) return <p>Error: {error.message}</p>;
  const { cuisineCollection } = data;
  return (
    <Suspense>
      <div style={{ paddingTop: "6rem", backgroundColor: "#EEEEEE" }}>
        <center>
          <h3 style={{ color: "#222831" }}>
            Journey Through Culinary Traditions!
          </h3>
        </center>
        <div className="cuisine-main">
          {cuisineCollection.items.map((cuisine) => (
            <Link
              legacyBehavior
              key={cuisine.slug}
              href={`/cuisines/${cuisine.slug}`}
            >
              <div className="cuisine-item">
                <img
                  src={cuisine.image.url}
                  className="cuisine-img"
                  alt="Image"
                />
                <h4 className="cuisine-text">
                  <h2>{cuisine.name}</h2>
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Suspense>
  );
}
