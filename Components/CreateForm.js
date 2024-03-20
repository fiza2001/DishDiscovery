"use client";
import { use, useState } from "react";
const contentful = require("contentful-management");
import { useQuery, gql } from "@apollo/client";
import client from "@/apolloClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const CHOOSE_CUISINE = gql`
  query {
    cuisineCollection {
      items {
        name
        slug
      }
    }
  }
`;

export function CreateForm() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [preparation, setPreparation] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [profilepic, setProfilepic] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    ingredients: "",
    preparation: "",
    description: "",
    calories: "",
    category: "",
    image: null,
    email: "",
    name: "",
    about: "",
    profilepic: "",
  });

  const { loading, error, data } = useQuery(CHOOSE_CUISINE, { client });

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
  const chooseCuisine = cuisineCollection.items;

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = { ...errors };
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else {
      newErrors.title = "";
    }
    if (!ingredients.trim()) {
      newErrors.ingredients = "Ingredients are required";
    } else {
      newErrors.ingredients = "";
    }
    if (!preparation.trim()) {
      newErrors.preparation = "Preparation is required";
    } else {
      newErrors.preparation = "";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else {
      newErrors.description = "";
    }
    if (!calories.trim()) {
      newErrors.calories = "Calories are required";
    } else {
      newErrors.calories = "";
    }
    if (!category) {
      newErrors.category = "Category is required";
    } else {
      newErrors.category = "";
    }
    if (!image) {
      newErrors.image = "Image is required";
    } else {
      newErrors.image = "";
    }
    if (!name) {
      newErrors.name = "Name is required";
    } else {
      newErrors.name = "";
    }
    if (!about) {
      newErrors.about = "About is required";
    } else {
      newErrors.about = "";
    }
    if (!profilepic) {
      newErrors.profilepic = "Profile Image is required";
    } else {
      newErrors.profilepic = "";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else {
      newErrors.email = "";
    }

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }
    setLoader(true);

    try {
      const client = contentful.createClient({
        accessToken: process.env.NEXT_PUBLIC_CMA,
      });

      // Upload image
      const space = await client.getSpace("8fhkkx1egwnn");
      const environment = await space.getEnvironment("master");
      const imageAsset = await environment.createAssetFromFiles({
        fields: {
          title: {
            "en-US": image.name,
          },
          file: {
            "en-US": {
              contentType: image.type,
              fileName: image.name,
              file: image,
            },
          },
        },
      });
      const profilePicAsset = await environment.createAssetFromFiles({
        fields: {
          title: {
            "en-US": profilepic.name,
          },
          file: {
            "en-US": {
              contentType: profilepic.type,
              fileName: profilepic.name,
              file: profilepic,
            },
          },
        },
      });
      const uploadedImage = await imageAsset.processForAllLocales();
      const uploadedProfilePic = await profilePicAsset.processForAllLocales();
      await uploadedImage.publish();
      await uploadedProfilePic.publish();

      // Create entry
      const entry = await environment.createEntry("dish", {
        fields: {
          title: {
            "en-US": title,
          },
          name: {
            "en-US": name,
          },
          email: {
            "en-US": email,
          },
          about: {
            "en-US": about,
          },
          category: {
            "en-US": category,
          },
          slug: {
            "en-US": title.toLowerCase().replace(/\s+/g, "-"),
          },
          ingredients: {
            "en-US": ingredients,
          },
          preparation: {
            "en-US": preparation,
          },
          description: {
            "en-US": description,
          },
          calories: {
            "en-US": calories,
          },
          category: {
            "en-US": category,
          },
          image: {
            "en-US": {
              sys: {
                type: "Link",
                linkType: "Asset",
                id: uploadedImage.sys.id,
              },
            },
          },
          profilepic: {
            "en-US": {
              sys: {
                type: "Link",
                linkType: "Asset",
                id: uploadedProfilePic.sys.id,
              },
            },
          },
        },
      });
      await entry.publish();
      setLoader(false);
      router.push(`/cuisines`);
    } catch (error) {
      console.error("Error creating entry:", error);
    } finally {
      setLoader(false);
      setTitle("");
      setIngredients("");
      setPreparation("");
      setDescription("");
      setCalories("");
      setCategory("");
      setImage(null);
      setName("");
      setAbout("");
      setEmail("");
      setProfilepic(null);
    }
  }

  return (
    <Suspense>
      <div
        className="container create-main"
        style={{ paddingTop: "6rem", paddingBottom: "3rem" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card" style={{ borderTop: "4px solid #222831" }}>
              <div className="card-body">
                <center className="card-title-form">
                  <h1>Create Recipe</h1>
                </center>
                <form onSubmit={handleSubmit}>
                  <div className="zero">
                    <div className="col-4">
                      <label className="mb-2" htmlFor="name">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        className="form-control"
                        onChange={(e) => setName(e.target.value)}
                        style={{ fontSize: "14px" }}
                        placeholder="Enter your name"
                      />
                      {errors.name && (
                        <span className="text-danger">{errors.name}</span>
                      )}
                    </div>
                    <div className="col-4">
                      <label className="mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ fontSize: "14px" }}
                        placeholder="Please enter your email"
                      />
                      {errors.email && (
                        <span className="text-danger">{errors.email}</span>
                      )}
                    </div>
                    <div className="col-4">
                      <label className="mb-2" htmlFor="profilepic">
                        Upload your photo
                      </label>
                      <input
                        type="file"
                        id="profilepic"
                        className="form-control"
                        onChange={(e) => setProfilepic(e.target.files[0])}
                        style={{ fontSize: "14px" }}
                      />
                      {errors.profilepic && (
                        <span className="text-danger">{errors.profilepic}</span>
                      )}
                    </div>
                  </div>
                  <div className="form-group pt-3">
                    <label className="mb-2" htmlFor="about">
                      About yourself
                    </label>
                    <textarea
                      className="form-control"
                      id="about"
                      value={about}
                      placeholder="Tell us about yourself"
                      onChange={(e) => setAbout(e.target.value)}
                      style={{
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.5",
                        fontSize: "14px",
                      }}
                      rows={5}
                      cols={50}
                    ></textarea>
                    {errors.about && (
                      <span className="text-danger">{errors.about}</span>
                    )}
                  </div>
                  <div className="one">
                    <div className="form-group pt-3 col-6">
                      <label className="mb-2" htmlFor="title">
                        Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        placeholder="Name of your recipe"
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ fontSize: "14px" }}
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </div>
                    <div className="form-group pt-3 col-4">
                      <label className="mb-2" htmlFor="category">
                        Cuisine
                      </label>
                      <select
                        className="form-control"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ fontSize: "14px" }}
                      >
                        <option value="">Select a cuisine</option>
                        {chooseCuisine.map((item) => (
                          <option key={item.slug} value={item.slug}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <span className="text-danger">{errors.category}</span>
                      )}
                    </div>
                  </div>
                  <div className="form-group pt-3">
                    <label className="mb-2" htmlFor="ingredients">
                      Ingredients
                    </label>
                    <textarea
                      className="form-control"
                      id="ingredients"
                      placeholder="Enter your ingredients seperated by (-). Ex: -Spinach -Onion"
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      style={{
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.5",
                        fontSize: "14px",
                      }}
                      rows={5}
                      cols={50}
                    ></textarea>
                    {errors.ingredients && (
                      <span className="text-danger">{errors.ingredients}</span>
                    )}
                  </div>
                  <div className="form-group pt-3">
                    <label className="mb-2" htmlFor="preparation">
                      Preparation
                    </label>
                    <textarea
                      className="form-control"
                      id="preparation"
                      placeholder="Enter your preparation instructions seperated by (-). Ex: -Take the pan -Heat the oil"
                      value={preparation}
                      onChange={(e) => setPreparation(e.target.value)}
                      style={{ fontSize: "14px" }}
                      rows={5}
                      cols={50}
                    ></textarea>
                    {errors.preparation && (
                      <span className="text-danger">{errors.preparation}</span>
                    )}
                  </div>
                  <div className="form-group pt-3">
                    <label className="mb-2" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      placeholder="Tell us about your dish"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ fontSize: "14px" }}
                      rows={5}
                      cols={50}
                    ></textarea>
                    {errors.description && (
                      <span className="text-danger">{errors.description}</span>
                    )}
                  </div>
                  <div className="two">
                    <div className="form-group pt-3 col-4">
                      <label htmlFor="calories">Calories</label>
                      <input
                        type="number"
                        className="form-control"
                        id="calories"
                        value={calories}
                        placeholder="Calories per 100g"
                        onChange={(e) => setCalories(e.target.value)}
                        style={{ fontSize: "14px" }}
                      />
                      {errors.calories && (
                        <span className="text-danger">{errors.calories}</span>
                      )}
                    </div>
                    <div className="form-group pt-3 pb-3 col-6">
                      <label className="mb-2" htmlFor="image">
                        Image
                      </label>
                      <br />
                      <input
                        type="file"
                        className="form-control-file"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                        style={{ fontSize: "14px", width: "100%" }}
                      />
                      {errors.image && (
                        <span className="text-danger">{errors.image}</span>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4 mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        // width: "20%",
                        backgroundColor: "#00ADB5",
                        fontWeight: "bold",
                        fontSize: "20px",
                        border: "none",
                        color: "#EEEEEE",
                      }}
                    >
                      {loader ? (
                        <div>
                          <SyncLoader color={"#EEEEEE"} size={5} margin={5} />
                        </div>
                      ) : (
                        "Post"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
