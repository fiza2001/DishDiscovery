"use client";
import { useQuery, gql } from "@apollo/client";
import client from "@/apolloClient";
import Link from "next/link";
import { createClient } from "contentful-management";
const contentful = require("contentful-management");
import { useRouter } from "next/navigation";
import { SyncLoader } from 'react-spinners';

export default function DishPage({ params }) {
  const router = useRouter();
  const getQuery = params.dishes;
  const capitalizedQuery = getQuery.charAt(0).toUpperCase() + getQuery.slice(1);
  const GET_DISH = gql`
    query GetDishes($category: String!) {
      dishCollection(where: { category: $category }) {
        items {
          sys {
            id
          }
          title(locale: "en-US")
          description(locale: "en-US")
          slug
          category
          image {
            url
          }
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_DISH, {
    client,
    variables: { category: getQuery },
  });

  if (loading) return( <div className="sweet-loading">
  <SyncLoader color={"#222831"} size={15} margin={5}/>
</div>)
  if (error) return <p>Error: {error.message}</p>;
  const { dishCollection } = data;

  function deleteEntry(entryId, entryCategory) {
    const client = contentful.createClient({
      accessToken: "CFPAT-DngYl9OCOyzx63dS07aiFrRegT5DcJhUjjjl4dU5eiE",
    });

    client
      .getSpace("8fhkkx1egwnn")
      .then((space) => space.getEnvironment("master"))
      .then((environment) => environment.getEntry(entryId))
      .then((entry) => entry.unpublish())
      .then(() => {
        return client
          .getSpace("8fhkkx1egwnn")
          .then((space) => space.getEnvironment("master"))
          .then((environment) => environment.getEntry(entryId))
          .then((entry) => entry.delete());
      })
      .then(() => alert("Entry deleted."))
      .then(() => window.location.reload())
      .catch(console.error);
  }

  return (
    <div style={{ marginTop: "5rem" }}>
      <center>
        <h1 style={{ color: "#726A95", marginBottom:'2rem' }}>{capitalizedQuery} Dishes</h1>
      </center>

      <div className="menu-main">
        {dishCollection.items.map((dish) => (
          <div key={dish.slug}>
            <Link
              href={`/cuisines/${getQuery}/${dish.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div key={dish.slug} className="menu-in-flex">
                <div>
                  <img src={dish.image.url} alt="Image" className="menu-img" />
                </div>
                <div className="menu-desc">
                  <h5 style={{ color: "#726A95" }}>{dish.title}</h5>
                  <p className="description">{dish.description}</p>
                </div>
                <button className="view-btn">View</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
