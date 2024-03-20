"use client";
import { useQuery, gql } from "@apollo/client";
import client from "@/apolloClient";
import { css } from "@emotion/react";
import { SyncLoader } from "react-spinners";
import { useState } from "react";
import { Suspense } from "react";

const GET_CONTENT = gql`
  query {
    dishaboutCollection {
      items {
        title
        about
        image {
          url
        }
      }
    }
  }
`;

export default function About() {
  const { loading, error, data } = useQuery(GET_CONTENT, { client });
  const [ring, setRing] = useState(true);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  if (loading)
    return (
      <Suspense>
        <div className="sweet-loading">
          <SyncLoader color={"#222831"} size={15} margin={5} />
        </div>
      </Suspense>
    );
  if (error) return <div>Error: {error.message}</div>;

  const { dishaboutCollection } = data;
  const about = dishaboutCollection.items[0];

  return (
    <Suspense>
      <div style={{ zIndex: "3" }}>
        <div className="abt-clr">
          <div>
            <h1>About Us</h1>
          </div>
        </div>
        <div style={{ marginTop: "-5%", marginLeft: "4%", marginRight: "4%" }}>
          <div className="abt-content">
            <img src="/images/about.jpg" className="abt-img" alt="about" />
            <p>{about.about}</p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
