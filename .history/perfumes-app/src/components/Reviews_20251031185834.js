import React, { useEffect, useState } from "react";

function Reviews({ productId, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:4000/reviews/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [productId, refreshTrigger]);

  // Auto-slide every 3s
  useEffect(() => {
    if (reviews.length > 1) {
      const timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % reviews.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [reviews]);

  if (!reviews.length)
    return <p className="text-muted mt-3">No reviews yet.</p>;

  return (
    <div className="text-center mt-4">
      <h5 className="fw-bold mb-3">Customer Reviews</h5>

      <div className="carousel-inner">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className={`carousel-item ${idx === activeIndex ? "active" : ""}`}
          >
            <blockquote className="blockquote">
              <p>"{rev.comment}"</p>
              <footer className="blockquote-footer">
                {rev.userId?.name || "Anonymous"} — {rev.rating} ⭐
              </footer>
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
