"use client";
import "../homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Testimonials from "../Testimonials";
import Contact from "../Contact";
import Latest from "../Latest";

export default function HomePage() {
  return (
    <div style={{marginTop:'3rem'}}>
      {/* introduction */}
      <div className="container-intro">
        <div>
          <div className="image-container-intro">
          <img
            className="intro-bg"
            src="/images/intro-bg.jpg"
            alt="Background"
          />
          <div className="text" style={{ padding: "20px" }}>
            <h1 style={{ fontSize: "calc(10px + 4vw)", margin: "0", color:'#EEEEEE' }}>
              Cook like a Chef!
            </h1>
            <h1 style={{ fontSize: "calc(10px + 4vw)", margin: "0", color:'#EEEEEE' }}>
              with{" "}
              <span
                style={{
                  color: "#00ADB5",
                  fontWeight: "bold",
                  fontSize: "calc(10px + 4vw)",
                }}
              >
                Dish Discovery
              </span>
            </h1>
            <p style={{ width: "80%", fontSize: "0.89rem", padding: "10px", color:'#EEEEEE' }}>
              Welcome to Dish Discovery, the ultimate destination for culinary
              inspiration and community engagement.
            </p>
            <div className="explore-btn-div">
              <Link href="/cuisines">
                <button className="custom-btn btn-3">
                  <span>Explore</span>
                </button>
              </Link>
            </div>
          </div>
          </div>
          {/* cuisine */}
          <div className="cuisine">
            <p>PERSONALIZE YOUR EXPERIENCE</p>
            <h2>What are Your Favorite Cuisines?</h2>
            <br />
            <br />
            <div class="text-center cuisine-li">
              <Link
                href="/cuisines/american"
                style={{ textDecoration: "none", color: "white" }}
              >
                <div>
                  <div class="circle am">American</div>
                </div>
              </Link>
              <Link
                href="/cuisines/french"
                style={{ textDecoration: "none", color: "white" }}
              >
                <div>
                  <div class="circle fr">French</div>
                </div>
              </Link>
              <Link
                href="/cuisines/indian"
                style={{ textDecoration: "none", color: "white" }}
              >
                <div>
                  <div class="circle in">Indian</div>
                </div>
              </Link>
              <Link
                href="/cuisines/mexican"
                style={{ textDecoration: "none", color: "white" }}
              >
                <div>
                  <div class="circle mex">Mexican</div>
                </div>
              </Link>
            </div>
          </div>
          {/* testimonials */}
          <div style={{backgroundColor:'#393E46'}}>
            <Testimonials />
          </div>
          {/* the latest */}
          <div>
            <Latest/>
          </div>
          {/* contact */}
          <div style={{marginBottom:'4%'}}>
            <Contact/>
          </div>
        </div>
      </div>
      
      <br />
      <br />
      <br />
    </div>
  );
}
