import "./homepage.css";

export default function Contact() {
  return (
    <form action="https://mail.google.com/" method="post" encType="text/plain">
      <div className="contact-main">
        <div className="image-container"></div>
        <div className="contact-content">
          <h2>
            Welcome to Dish Discovery master class, part classroom, part
            playground and all kitchen.
          </h2>
          <hr />
          <p>
            The master class will make you understand the culinary processes,
            interact with products and interpret the art...
          </p>
          <br />
          <button type="submit" className="custom-btn btn-1">
            <b>Mail Us</b>
          </button>
        </div>
      </div>
    </form>

    // <div className="contact-main">
    //     <div className="image-container"></div>
    //     <div className="contact-content">
    //         <h2>Welcome to Dish Discovery master class, part classroom, part playground and all kitchen.</h2>
    //         <hr/>
    //         <p>The master class will make you understand the culinary processess, interact with products and interpret the art...</p>
    //         <br/>
    //         <button class="custom-btn btn-1"><b>Mail Us</b></button>
    //     </div>
    // </div>
  );
}
