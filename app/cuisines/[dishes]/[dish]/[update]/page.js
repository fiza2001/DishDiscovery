"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "contentful-management";
import { useQuery, gql } from "@apollo/client";
import client from "@/apolloClient";
const contentful = require("contentful-management");
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners";

const CHOOSE_CUISINE = gql`
  query {
    cuisineCollection {
      items {
        sys {
          id
        }
        name
        slug
      }
    }
  }
`;

export default function Update() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const [title, setTitle] = useState(params.get("title"));
  const [id, setId] = useState(params.get("id"));
  const [slug, setSlug] = useState(params.get("slug"));
  const [description, setDescription] = useState(params.get("description"));
  const [ingredients, setIngredients] = useState(params.get("ingredients"));
  const [preparation, setPreparation] = useState(params.get("preparation"));
  const [calories, setCalories] = useState(params.get("calories"));
  const [category, setCategory] = useState(params.get("category"));
  const [image, setImage] = useState();
  const [email, setEmail] = useState(params.get("email"));
  const [name, setName] = useState(params.get("name"));
  const [about, setAbout] = useState(params.get("about"));
  const [profilepic, setProfilepic] = useState();
  const [loading, setLoading] = useState(false);
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
    profilepic: null,
  });

  const { error, data, refetch } = useQuery(CHOOSE_CUISINE, { client });

  if (loading)
    return (
      <div className="sweet-loading">
        <SyncLoader color={"#222831"} size={15} margin={5} />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  const handleUpdate = async (event) => {
    event.preventDefault();
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
    setLoading(true);

    const client = createClient({
      accessToken: process.env.NEXT_PUBLIC_CMA,
    });

    try {
      // Upload image
      const Imgspace = await client.getSpace("8fhkkx1egwnn");
      const Imgenvironment = await Imgspace.getEnvironment("master");
      const imageAsset = await Imgenvironment.createAssetFromFiles({
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
      const profilePicAsset = await Imgenvironment.createAssetFromFiles({
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

      //   update entry
      const space = await client.getSpace("8fhkkx1egwnn");
      const environment = await space.getEnvironment("master");
      let entry = await environment.getEntry(id);

      entry.fields.title["en-US"] = title;
      entry.fields.slug["en-US"] = title.toLowerCase().replace(/\s+/g, "-");
      entry.fields.description["en-US"] = description;
      entry.fields.ingredients["en-US"] = ingredients;
      entry.fields.preparation["en-US"] = preparation;
      entry.fields.calories["en-US"] = calories;
      entry.fields.category["en-US"] = category;
      entry.fields.name["en-US"] = name;
      entry.fields.about["en-US"] = about;
      entry.fields.email["en-US"] = email;
      entry.fields.image["en-US"] = {
        sys: {
          type: "Link",
          linkType: "Asset",
          id: uploadedImage.sys.id,
        },
      };
      entry.fields.profilepic["en-US"] = {
        sys: {
          type: "Link",
          linkType: "Asset",
          id: uploadedProfilePic.sys.id,
        },
      };
      await entry.update();

      // Fetch the updated entry again
      entry = await environment.getEntry(id);

      // Publish the entry
      try {
        await entry.publish();
        await entry.refetch();
      } catch (publishError) {
        console.error("Error publishing entry:", publishError);
      }
    } catch (error) {
      console.error("Error updating entry:", error);
    } finally {
      setLoading(false);
      window.location.href = `/cuisines/${category}`
      // router.push(`/cuisines/${category}`); 
    }
  };

  return (
    <div
      className="container create-main"
      style={{ marginTop: "6rem", marginBottom: "3rem" }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card" style={{ borderTop: "4px solid #222831" }}>
            <div className="card-body">
              <center className="card-title-form">
                <h1>Update Recipe</h1>
              </center>
              <form onSubmit={handleUpdate}>
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
                      {/* <option value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option> */}
                      <option value="american">American</option>
                      <option value="french">French</option>
                      <option value="mexican">Mexican</option>
                      <option value="indian">Indian</option>
                      {/* {chooseCuisine.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))} */}
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
                      placeholder="Calories for 100g"
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
                    disabled={loading}
                    style={{
                      width: "20%",
                      backgroundColor: "#00ADB5",
                      color:'#EEEEEE',
                      fontWeight: "bold",
                      fontSize: "20px",
                      border: "none",
                    }}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
