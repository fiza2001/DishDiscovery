import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

const latestData = [
  {
    id: 1,
    title: "Coq au Vin",
    url:'/cuisines/french/coq-au-vin',
    img: "./images/l1.jpg",
    desc: 'Coq au Vin is a classic French dish that translates to "rooster in wine...',
  },
  {
    id: 2,
    title: "Butter Chicken",
    url:'/cuisines/indian/butter-chicken',
    img: "./images/l2.webp",
    desc: "Butter chicken is one of the most famous dishes associated with Indian rich...",
  },
  {
    id: 3,
    title: "Jambalaya",
    url:'/cuisines/american/jambalaya-jack',
    img: "./images/l3.jpg",
    desc: "Hands-down the best jambalaya recipe! It is surprisingly easy to make...",
  },
  {
    id: 4,
    title: "Guacamole",
    url:'/cuisines/mexican/mexican-guacamole',
    img: "./images/l4.webp",
    desc: "Guacamole is a staple of Mexican cuisine. Although it is pretty simple to...",
  },
];

export default function Latest() {
  return (
    <Container className='pb-3'>
        <center><h2 className='pt-5 pb-4'>The Latest and Greatest</h2></center>
        
    <Row className="justify-content-center align-items-center">
      {latestData.map((item) => (
        <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center align-items-center">
          <Card style={{ width: '18rem'}} className='home-card'>
            <Card.Img variant="top" src={item.img} style={{ height: '200px', objectFit: 'cover' }} />
            <Card.Body className="text-left">
              <div>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text className="text-muted">{item.desc}</Card.Text>
              </div>
              <div className='mt-3 mb-2'>
                <Link href={item.url}>
                <button className='view-btn'>View</button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
    // <div className="d-flex flex-wrap">
    //   {latestData.map((item) => (
    //     <div key={item.id} style={{ margin: '15px' }}>
    //       <Card style={{ width: '18rem' }}>
    //         <Card.Img variant="top" src={item.img} style={{ height: '200px', objectFit: 'cover' }}/>
    //         <Card.Body>
    //           <Card.Title>{item.title}</Card.Title>
    //           <Card.Text>{item.desc}</Card.Text>
    //           <div className="mt-auto">
    //             <Button variant="primary">View</Button>
    //           </div>
    //         </Card.Body>
    //       </Card>
    //     </div>
    //   ))}
    // </div>
  );
}
