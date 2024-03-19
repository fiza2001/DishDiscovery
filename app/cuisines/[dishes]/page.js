"use client";
import { useQuery, gql } from "@apollo/client";
import client from "@/apolloClient";
import Link from "next/link";
import { createClient } from "contentful-management";
import { useSession } from "next-auth/react";
const contentful = require("contentful-management");
import { useRouter } from "next/navigation";
import { SyncLoader } from "react-spinners";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Suspense } from "react";

export default function DishPage({ params }) {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [dishToDelete, setDishToDelete] = useState(null);
  const router = useRouter();
  const getQuery = params.dishes;
  const capitalizedQuery = getQuery.charAt(0).toUpperCase() + getQuery.slice(1);

  const handleClose = () => {
    setShow(false);
    setDone(false);
  };
  function handleDeleteShow(entryId, entryCategory, entryTitle) {
    setIdToDelete(entryId);
    setCategoryToDelete(entryCategory);
    setDishToDelete(entryTitle);
    setShow(true);
  }

  let GetEmail = "";
  if (session) {
    GetEmail = session.user.email;
  } else {
    GetEmail = "";
  }

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
          email
          category
          image {
            url
          }
        }
      }
    }
  `;
  const { loading, error, data, refetch } = useQuery(GET_DISH, {
    client,
    variables: { category: getQuery },
  });

  useEffect(() => {
    if (data) {
      refetch();
    }
  }, [data, refetch]);

  if (loading)
    return (
      <div className="sweet-loading">
        <SyncLoader color={"#222831"} size={15} margin={5} />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;
  const { dishCollection } = data;

  // delete
  function deleteEntry() {
    setDeleteLoader(true);
    const client = contentful.createClient({
      accessToken: "CFPAT-DngYl9OCOyzx63dS07aiFrRegT5DcJhUjjjl4dU5eiE",
    });

    client
      .getSpace("8fhkkx1egwnn")
      .then((space) => space.getEnvironment("master"))
      .then((environment) => environment.getEntry(idToDelete))
      .then((entry) => entry.unpublish())
      .then(() => {
        return client
          .getSpace("8fhkkx1egwnn")
          .then((space) => space.getEnvironment("master"))
          .then((environment) => environment.getEntry(idToDelete))
          .then((entry) => entry.delete());
      })
      .then(() => setDeleteLoader(false))
      .then(() => setShow(false))
      .then(() => setDone(true))
      .then(() => refetch())
      .catch(console.error);
  }

  return (
    <Suspense>
      <div style={{ marginTop: "5rem" }}>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure want to delete {dishToDelete} ?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            {deleteLoader ? (
              <Button variant="primary">
                <SyncLoader color={"#EEEEEE"} size={5} margin={5} />
              </Button>
            ) : (
              <Button variant="primary" onClick={deleteEntry}>
                Delete
              </Button>
            )}
          </Modal.Footer>
        </Modal>
        {/* delete success */}
        <Modal show={done} onHide={handleClose}>
          <Modal.Header>
            <b>
              <h5>
                <FontAwesomeIcon icon={faCheck} className="success-icon" />
                Success
              </h5>
            </b>
          </Modal.Header>
          <Modal.Body>
            Entry for {dishToDelete} Deleted Successfully!
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
        <center>
          <h1 style={{ color: "#726A95", marginBottom: "2rem" }}>
            {capitalizedQuery} Dishes
          </h1>
        </center>

        <div className="menu-main">
          {dishCollection.items.map((dish) => (
            <div key={dish.slug}>
              {/* <Link
              href={`/cuisines/${getQuery}/${dish.slug}`}
              style={{ textDecoration: "none" }}
            > */}
              <div key={dish.slug} className="menu-in-flex">
                <div>
                  <img src={dish.image.url} alt="Image" className="menu-img" />
                </div>
                <div className="menu-desc">
                  <h5 style={{ color: "#726A95" }}>{dish.title}</h5>
                  <p className="description">{dish.description}</p>
                </div>
                {session && dish.email === GetEmail ? (
                  <div style={{ marginTop: "auto" }}>
                    <button
                      onClick={() =>
                        handleDeleteShow(dish.sys.id, dish.category, dish.title)
                      }
                      className="delete-button"
                      style={{ marginRight: "10px" }}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
                <Link
                  href={`/cuisines/${getQuery}/${dish.slug}`}
                  style={{ textDecoration: "none", marginTop: "auto" }}
                >
                  <button className="view-btn" style={{ marginTop: "5px" }}>
                    View
                  </button>
                </Link>
              </div>
              {/* </Link> */}
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
}
