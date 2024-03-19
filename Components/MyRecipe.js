"use client";
import { useQuery, gql } from "@apollo/client";
import client from "@/apolloClient";
import Link from "next/link";
import { createClient } from "contentful-management";
const contentful = require("contentful-management");
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SyncLoader } from "react-spinners";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function MyRecipe({ params }) {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [dishToDelete, setDishToDelete] = useState(null)
  const router = useRouter();

  const handleClose = () => {
    setShow(false);
    setDone(false);
  };
  function handleDeleteShow(entryId, entryCategory, entryTitle) {
    setIdToDelete(entryId);
    setCategoryToDelete(entryCategory);
    setDishToDelete(entryTitle)
    setShow(true);
  }

  let GetEmail = "";
  if (session) {
    GetEmail = session.user.email;
  } else {
    GetEmail = "";
  }
  const GET_MY_RECIPE = gql`
    query GetDishes($email: String!) {
      dishCollection(where: { email: $email }) {
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
  const { loading, error, data, refetch } = useQuery(GET_MY_RECIPE, {
    client,
    variables: { email: GetEmail },
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
    <div style={{ marginTop: "5rem", height: "100%" }}>
      {/* delete confirmation */}
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
        <Modal.Header><b><h5><FontAwesomeIcon icon={faCheck} className="success-icon"/>Success</h5></b></Modal.Header>
        <Modal.Body>Entry for {dishToDelete} Deleted Successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <center>
        <h1 style={{ color: "#393E46" }}>My recipes</h1>
      </center>
      <div className="dish-container">
        {session && dishCollection.items.length > 0 ? (
          dishCollection.items.map((dish) => (
            <div key={dish.slug} className="dish-item">
              <Link
                href={`/cuisines/${dish.category}/${dish.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div className="dish-image-container">
                  <img
                    src={dish.image.url}
                    alt="Image"
                    className="dish-image"
                  />
                </div>
                <div className="dish-content">
                  <h5
                    style={{
                      color: "#222831",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                  >
                    {dish.title}
                  </h5>
                  <p
                    style={{
                      color: "grey",
                      maxHeight: "4.8em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: "1.6em",
                      maxWidth: "300px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                  >
                    {dish.description}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handleDeleteShow(dish.sys.id, dish.category, dish.title)}
                className="delete-button"
              >
                Delete
              </button>
              {/* <button
                onClick={() => deleteEntry(dish.sys.id, dish.category)}
                className="delete-button"
              >
                Delete
              </button> */}
            </div>
          ))
        ) : (
          <>
            {session ? (
              <div className="mt-4 text-center">
              <p>There are currently no recipes</p><br/>
              <Link href='/create'><button className="view-btn">Create Recipe</button></Link>
              </div>
            ) : (
              <Link href="/api/auth/signin">Sign in to view</Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
