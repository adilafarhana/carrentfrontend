import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Table, Card, Badge, Button, Spinner, Alert, Modal,
  Placeholder, Container, Row, Col
} from 'react-bootstrap';
import {
  FaCar, FaUser, FaCalendarAlt, FaMoneyBillWave,
  FaFileAlt, FaCheck, FaTruck, FaArrowLeft
} from 'react-icons/fa';

const CarBookingsDetailsPage = () => {
  const [car, setCar] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState({
    car: true,
    bookings: true
  });
  const [error, setError] = useState('');
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const carId = location.state?.carId;

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  const fetchCarDetails = useCallback(async () => {
    try {
      const response = await axios.post(
        'https://carrentbackend-1-tpmm.onrender.com/getCarById',
        { id: carId },
        requestHeader
      );
      setCar(response.data);
    } catch (err) {
      setError(`Failed to load car details: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, car: false }));
    }
  }, [carId]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.post(
        'https://carrentbackend-1-tpmm.onrender.com/getbooking',
        { carId },
        requestHeader
      );
      setBookings(response.data);
    } catch (err) {
      setError(`Failed to load bookings: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  }, [carId]);

  useEffect(() => {
    if (carId) {

      Promise.all([fetchCarDetails(), fetchBookings()])
        .catch(err => {
          setError(`Initialization error: ${err.message}`);
        });
    }
  }, [carId, fetchCarDetails, fetchBookings]);

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.post(
        'https://carrentbackend-1-tpmm.onrender.com/updateOrderStatus',
        { id: bookingId, status: newStatus },
        requestHeader
      );

      setBookings(prev => prev.map(booking =>
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));

      if (newStatus === 'Delivered') {
        setCar(prev => ({ ...prev, status: 'Not Available' }));
      }
    } catch (err) {
      setError(`Status update failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const viewDocuments = (docs) => {
    setSelectedDocs(docs);
    setShowDocsModal(true);
  };

  const LoadingSkeleton = () => (
    <Container>
      <Card className="mb-4">
        <Card.Header>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Placeholder as={Card.Img} animation="glow" style={{ height: '200px' }} />
            </Col>
            <Col md={8}>
              <Placeholder as={Row} animation="glow">
                {[...Array(6)].map((_, i) => (
                  <Col key={i} md={6}>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={4} /> <Placeholder xs={6} />
                    </Placeholder>
                  </Col>
                ))}
              </Placeholder>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={8} />
          </Placeholder>
        </Card.Header>
        <Card.Body>
          <Table striped hover>
            <thead>
              <tr>
                {['Customer', 'Contact', 'Date/Time', 'Details', 'Payment', 'Status', 'Actions'].map((header, i) => (
                  <th key={i}>
                    <Placeholder as="span" animation="glow">
                      <Placeholder xs={6} />
                    </Placeholder>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j}>
                      <Placeholder as="div" animation="glow">
                        <Placeholder xs={12} />
                        {j === 0 && <Placeholder xs={8} />}
                      </Placeholder>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <FaArrowLeft className="me-1" /> Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (loading.car || loading.bookings) {
    return <LoadingSkeleton />;
  }

  if (!car) {
    return (
      <Container className="mt-5 text-center">
        <FaCar size={48} className="text-muted mb-3" />
        <h4>Car not found</h4>
        <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3">
          <FaArrowLeft className="me-1" /> Back to Cars List
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">

      {!loading.car && car && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">
              <FaCar className="me-2" />
              {car.brand} {car.model} - {car.type === 'Rent' ? 'Rental' : 'Used'} Car
            </h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                {car.images?.length > 0 && (
                  <img
                    src={`https://carrentbackend-1-tpmm.onrender.com${car.images[0]}`}
                    alt={car.model}
                    className="img-fluid rounded"
                    style={{ height: '200px', objectFit: 'cover' }}
                    loading="lazy"
                  />
                )}
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={6}>
                    <p><strong>Status:</strong>
                      <Badge bg={car.status === 'Available' ? 'success' : 'danger'} className="ms-2">
                        {car.status}
                      </Badge>
                    </p>
                    <p><strong>Year:</strong> {car.year}</p>
                    <p><strong>Color:</strong> {car.color}</p>
                    <p><strong>Mileage:</strong> {car.mileage} km</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Fuel Type:</strong> {car.fuelType}</p>
                    <p><strong>Transmission:</strong> {car.transmission}</p>
                    <p><strong>Seats:</strong> {car.seatingCapacity}</p>
                    {car.type === 'Rent' ? (
                      <p><strong>Base Price:</strong> ₹{car.rentalPricePerHour}/hour</p>
                    ) : (
                      <p><strong>Price:</strong> ₹{car.price}</p>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <FaCalendarAlt className="me-2" />
              Booking History ({bookings.length})
            </h4>
          </div>
        </Card.Header>
        <Card.Body>
          {bookings.length === 0 ? (
            <div className="text-center py-4">
              <FaCalendarAlt size={48} className="text-muted mb-3" />
              <h5>No bookings found for this car</h5>
            </div>
          ) : (
            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <Table striped hover className="align-middle">
                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                  <tr>
                    <th><FaUser className="me-1" /> Customer</th>
                    <th>Contact</th>
                    <th>Date/Time</th>
                    {car.type === 'Rent' && <th>Rental Details</th>}
                    <th><FaMoneyBillWave className="me-1" /> Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <strong>{booking.fullName}</strong><br />
                        <small className="text-muted">{booking.email}</small>
                      </td>
                      <td>
                        {booking.phone}<br />
                        <small>{booking.place}</small>
                      </td>
                      <td>
                        {new Date(booking.date).toLocaleDateString()}<br />
                        <small>{booking.time}</small>
                      </td>
                      {car.type === 'Rent' && (
                        <td>
                          <strong>Duration:</strong> {booking.duration} {booking.rentalPeriod?.includes('Hour') ? 'hours' :
                            booking.rentalPeriod?.includes('day') ? 'days' :
                              booking.rentalPeriod?.includes('weak') ? 'weeks' : 'months'}<br />
                          <strong>Total:</strong> ₹{booking.totalPrice}
                        </td>
                      )}
                      <td>
                        <Badge bg={booking.paymentStatus === 'success' ? 'success' : 'warning'}>
                          {booking.paymentStatus || 'Pending'}
                        </Badge><br />
                        <small>Method: {booking.paymentMethod}</small>
                        {car.type === 'Rent' && booking.advancePayment && (
                          <small className="d-block">Advance: ₹{booking.advancePayment}</small>
                        )}
                      </td>
                      <td>
                        <Badge bg={
                          booking.status === 'Pending' ? 'warning' :
                            booking.status === 'Confirmed' ? 'info' :
                              booking.status === 'Delivered' ? 'success' : 'secondary'
                        }>
                          {booking.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {booking.images?.length > 0 && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => viewDocuments(booking.images)}
                              className="mb-1"
                            >
                              <FaFileAlt /> Docs
                            </Button>
                          )}
                          {booking.status !== 'Confirmed' && (
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => updateBookingStatus(booking._id, 'Confirmed')}
                              className="mb-1"
                            >
                              <FaCheck /> Confirm
                            </Button>
                          )}
                          {booking.status !== 'Delivered' && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => updateBookingStatus(booking._id, 'Delivered')}
                              className="mb-1"
                            >
                              <FaTruck /> Deliver
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Documents Modal */}
      <Modal show={showDocsModal} onHide={() => setShowDocsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Customer Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row>
            {selectedDocs.map((doc, index) => (
              <Col key={index} md={6} className="mb-4">
                <div className="border rounded p-2" style={{ height: '300px', overflow: 'hidden' }}>
                  <img
                    src={`https://carrentbackend-1-tpmm.onrender.com${doc}`}
                    alt={`Document ${index + 1}`}
                    className="img-fluid h-100 w-100 object-fit-contain"
                    loading="lazy"
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDocsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="text-center mt-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Back to Cars List
        </Button>
      </div>
    </Container>
  );
};

export default CarBookingsDetailsPage;